import Stripe from 'stripe';
import { readUsers, writeUsers } from './auth';
import { createPostNordShipment } from './postnord.server';
import { sendNewOrderAdminNotification } from './orderConfirmation';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret, { apiVersion: '2026-04-22.dahlia' });

function getShippingDetails(session: Stripe.Checkout.Session) {
  return (
    (session as any).shipping_details ||
    session.customer_details ||
    session.collected_information?.shipping_details ||
    null
  ) as { name?: string | null; phone?: string | null; address?: Stripe.Address | null } | null;
}

export interface SaveOrderResult {
  order: any | null;
  created: boolean;
  email: string | null;
}

/**
 * Idempotently create the order record for a completed Stripe Checkout session.
 * Safe to call multiple times (webhook + success page) — it will not duplicate.
 * Does NOT book PostNord; shipping labels are created at ship-time from the admin panel.
 */
export async function saveOrderForSession(sessionId: string): Promise<SaveOrderResult> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  const email = session.customer_email || session.customer_details?.email || null;
  if (!email) {
    return { order: null, created: false, email: null };
  }

  const users = await readUsers();
  let user: any = users.find((u: any) => u.email === email);
  if (!user) {
    user = { email, name: session.customer_details?.name || null, orders: [] };
    users.push(user);
  }
  if (!user.orders) user.orders = [];

  // Idempotency guard — never create a duplicate order for the same session.
  const existing = user.orders.find(
    (o: any) => o.sessionId === session.id || o.id === session.id
  );
  if (existing) {
    return { order: existing, created: false, email };
  }

  const shippingDetails = getShippingDetails(session);
  const order: any = {
    id: session.id,
    sessionId: session.id,
    items:
      session.line_items?.data.map((item: any) => ({
        name: item.description || item.price?.product?.name || 'Produkt',
        quantity: item.quantity,
        price: (item.price?.unit_amount || 0) / 100,
      })) || [],
    totalAmount: (session.amount_total || 0) / 100,
    currency: session.currency?.toUpperCase() || 'SEK',
    // Shipping lifecycle status shown/managed in the admin panel.
    status: 'not_shipped',
    paymentStatus: session.payment_status || 'paid',
    paymentMethod: session.payment_method_types?.[0] || 'card',
    billingAddress: session.customer_details || null,
    shippingAddress: {
      name: shippingDetails?.name || session.customer_details?.name || null,
      phone: shippingDetails?.phone || session.customer_details?.phone || null,
      address: shippingDetails?.address || null,
    },
    shippingOption:
      session.metadata?.shipping_option_label ||
      session.metadata?.shipping_option ||
      null,
    shippingPostcode: session.metadata?.shipping_postcode || null,
    postnordShipmentId: null,
    postnordLabelUrl: null,
    postnordLabelPdfUrl: null,
    postnordTracking: null,
    createdAt: new Date((session.created || Date.now() / 1000) * 1000).toISOString(),
  };

  // Auto-create the PostNord shipment/label at order time so it appears in
  // "Mina försändelser" ready to print. Non-fatal if it fails — the order is
  // still created and the admin can retry from the panel.
  const isPostNord = String(order.shippingOption || '').toLowerCase().includes('postnord');
  if (isPostNord && order.shippingAddress?.address) {
    try {
      const shipment = await createPostNordShipment({
        orderId: order.id,
        packageDescription: `Order ${order.id}`,
        items: order.items,
        totalAmount: order.totalAmount,
        customerEmail: email,
        shippingDetails: {
          name: order.shippingAddress.name,
          phone: order.shippingAddress.phone || '',
          address: order.shippingAddress.address,
        },
      });
      if (shipment) {
        order.postnordShipmentId = shipment.shipmentId;
        order.postnordTracking = shipment.trackingNumber || null;
        order.postnordLabelUrl = shipment.labelUrl || null;
        order.postnordLabelPdfUrl = shipment.labelPdfUrl || null;
        console.log(`PostNord label auto-created for order ${order.id}: tracking=${order.postnordTracking}`);
      }
    } catch (e) {
      console.error(`PostNord auto-booking failed for order ${order.id} (non-fatal):`, e);
    }
  }

  user.orders.push(order);
  await writeUsers(users);

  // Notify the business owner of the new order (once, on creation). Non-fatal.
  try {
    await sendNewOrderAdminNotification(order, email);
    console.log(`New-order notification sent to business owner for order ${order.id}`);
  } catch (e) {
    console.error(`Failed to send new-order notification for ${order.id} (non-fatal):`, e);
  }

  return { order, created: true, email };
}
