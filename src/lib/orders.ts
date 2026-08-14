import Stripe from 'stripe';
import { readUsers, writeUsers } from './auth';
import { createPostNordShipment } from './postnord.server';
import { createShipmondoShipment } from './shipmondo.server';
import { getCarrier, type CarrierId } from './carriers';
import { commissionForItems } from './affiliates';
import { sendNewOrderAdminNotification } from './orderConfirmation';
import { readData, writeData } from './dataStore';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret, { apiVersion: '2026-04-22.dahlia' });

// ── Embedded (on-site) checkout: draft stored at PaymentIntent creation,
//    finalized into a real order when payment_intent.succeeded fires. ──
export interface OrderDraft {
  items: { name: string; price: number; quantity: number; units?: number; image?: string }[];
  customer: { email: string; name: string; phone?: string };
  shipping: {
    method: 'pickup' | 'postnord';
    carrier?: CarrierId;
    country: string;
    line1?: string;
    line2?: string;
    postcode?: string;
    city?: string;
  };
  discountCode?: string;
  discountAmount?: number;
  affiliateCode?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  // Set for "Prenumerera & spara 20%" orders. Each monthly invoice reuses the
  // saved draft to create a fresh order + shipment.
  isSubscription?: boolean;
  subscriptionId?: string;
  billingInterval?: 'month';
}

export async function savePendingOrder(piId: string, draft: OrderDraft): Promise<void> {
  await writeData(`pending_${piId}.json`, draft);
}

async function readPendingOrder(piId: string): Promise<OrderDraft | null> {
  return readData<OrderDraft | null>(`pending_${piId}.json`, null);
}

// Post-purchase upsell — recorded durably so it's still applied even when the
// upsell charge lands before the order is finalized (a race that previously
// dropped the extra bottles from the order).
export async function savePendingUpsell(piId: string, upsell: { items: any[]; total: number }): Promise<void> {
  await writeData(`upsell_${piId}.json`, { ...upsell, ts: Date.now() });
}

export async function applyPendingUpsell(order: any, piId: string): Promise<boolean> {
  if (order.upsellCharged) return false;
  const up = await readData<{ items?: any[]; total?: number } | null>(`upsell_${piId}.json`, null);
  if (!up || !Array.isArray(up.items) || up.items.length === 0) return false;
  order.items = [...(order.items || []), ...up.items];
  order.totalAmount = Math.round(((order.totalAmount || 0) + (Number(up.total) || 0)) * 100) / 100;
  order.upsellCharged = true;
  return true;
}

// Subscriptions store their draft keyed by the Stripe subscription id, so every
// recurring invoice (first + monthly renewals) can build a fresh order.
export async function savePendingSubscriptionOrder(subId: string, draft: OrderDraft): Promise<void> {
  await writeData(`pending_sub_${subId}.json`, draft);
}

async function readPendingSubscriptionOrder(subId: string): Promise<OrderDraft | null> {
  return readData<OrderDraft | null>(`pending_sub_${subId}.json`, null);
}

function carrierInfoForDraft(draft: OrderDraft) {
  const carrierId = (draft.shipping.carrier || draft.shipping.method) as CarrierId;
  const carrier = getCarrier(carrierId);
  const provider = carrier?.provider || (draft.shipping.method === 'postnord' ? 'postnord' : 'pickup');
  const needsAddress = carrier ? carrier.needsAddress : draft.shipping.method === 'postnord';
  return { carrierId, carrier, provider, needsAddress };
}

/** Build the order record from a stored draft. Pure — performs no I/O. */
function makeOrderRecord(
  orderId: string,
  draft: OrderDraft,
  opts?: { isSubscription?: boolean; subscriptionId?: string }
) {
  const email = draft.customer.email;
  const { carrierId, carrier, provider, needsAddress } = carrierInfoForDraft(draft);

  // Affiliate commission: 50 kr per bottle sold through the link.
  const affiliateBottles = draft.affiliateCode
    ? draft.items.reduce((s, it) => s + (it.units ?? 1) * it.quantity, 0)
    : 0;
  const affiliateCommission = draft.affiliateCode ? commissionForItems(draft.items) : 0;

  const order: any = {
    id: orderId,
    sessionId: orderId,
    paymentIntentId: orderId,
    isSubscription: !!opts?.isSubscription,
    subscriptionId: opts?.subscriptionId || null,
    items: draft.items.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price, units: it.units ?? 1 })),
    totalAmount: draft.total,
    currency: 'SEK',
    discountCode: draft.discountCode || null,
    discountAmount: draft.discountAmount || 0,
    affiliateCode: draft.affiliateCode || null,
    affiliateBottles,
    affiliateCommission,
    status: 'not_shipped',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    billingAddress: { name: draft.customer.name, email, phone: draft.customer.phone || '' },
    shippingAddress: {
      name: draft.customer.name || null,
      phone: draft.customer.phone || null,
      address: needsAddress
        ? {
            line1: draft.shipping.line1 || '',
            line2: draft.shipping.line2 || '',
            postal_code: draft.shipping.postcode || '',
            city: draft.shipping.city || '',
            country: draft.shipping.country || '',
          }
        : null,
    },
    carrier: carrierId,
    carrierProvider: provider,
    shippingOption: carrier?.brand || (draft.shipping.method === 'postnord' ? 'PostNord' : 'Uthämtning'),
    shippingPostcode: draft.shipping.postcode || null,
    shippingCountry: draft.shipping.country || 'SE',
    shippingCost: draft.shippingCost,
    postnordShipmentId: null,
    postnordLabelUrl: null,
    postnordLabelPdfUrl: null,
    postnordTracking: null,
    shipmondoShipmentId: null,
    shipmondoTracking: null,
    createdAt: new Date().toISOString(),
  };

  return { order, carrier, provider, needsAddress, email };
}

/**
 * Auto-book the shipment/label for an order at order time so it's ready to
 * print. Mutates `order`. Non-fatal: the order is still valid if this fails and
 * the admin can retry from the panel.
 */
async function autoBookShipment(
  order: any,
  carrier: ReturnType<typeof getCarrier>,
  provider: string,
  needsAddress: boolean,
  email: string
) {
  if (!(needsAddress && order.shippingAddress?.address)) return;
  try {
    if (provider === 'postnord') {
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
      }
    } else if (provider === 'shipmondo') {
      const productCode = carrier?.productEnv ? process.env[carrier.productEnv] || '' : '';
      const shipment = await createShipmondoShipment({
        orderId: order.id,
        productCode,
        customerEmail: email,
        recipient: {
          name: order.shippingAddress.name,
          phone: order.shippingAddress.phone || '',
          address: order.shippingAddress.address,
        },
      });
      if (shipment) {
        order.shipmondoShipmentId = shipment.shipmentId;
        order.shipmondoTracking = shipment.trackingNumber || null;
      }
    }
  } catch (e) {
    console.error(`Shipment auto-booking (${provider}) failed for order ${order.id} (non-fatal):`, e);
  }
}

/**
 * Finalize a paid on-site order from its PaymentIntent. Idempotent — safe to
 * call multiple times. Creates the order, books the PostNord label (if
 * applicable) and notifies the business owner. Returns the created order.
 */
export async function finalizeOrderFromPaymentIntent(
  piId: string
): Promise<{ order: any | null; created: boolean; email: string | null }> {
  const draft = await readPendingOrder(piId);
  if (!draft) return { order: null, created: false, email: null };

  const email = draft.customer.email;
  const users = await readUsers();
  let user: any = users.find((u: any) => u.email === email);
  if (!user) {
    user = { email, name: draft.customer.name || null, orders: [] };
    users.push(user);
  }
  if (!user.orders) user.orders = [];

  const existing = user.orders.find((o: any) => o.id === piId || o.sessionId === piId);
  if (existing) return { order: existing, created: false, email };

  const { order, carrier, provider, needsAddress } = makeOrderRecord(piId, draft);
  // Merge any upsell that was charged before this order got saved (so the label
  // weight + fulfilment include the extra bottles).
  await applyPendingUpsell(order, piId);
  await autoBookShipment(order, carrier, provider, needsAddress, email);

  user.orders.push(order);
  await writeUsers(users);

  try {
    await sendNewOrderAdminNotification(order, email);
  } catch (e) {
    console.error(`Failed to send new-order notification for ${order.id}:`, e);
  }

  return { order, created: true, email };
}

/**
 * Finalize a paid subscription invoice into an order. Fires for both the first
 * payment (billing_reason `subscription_create`) and every monthly renewal
 * (`subscription_cycle`) — each invoice creates its own order + shipment so the
 * customer gets a fresh delivery and confirmation every month. Idempotent per
 * invoice id.
 */
export async function finalizeSubscriptionOrderFromInvoice(
  invoice: Stripe.Invoice
): Promise<{ order: any | null; created: boolean; email: string | null }> {
  const subRef = invoice.parent?.subscription_details?.subscription;
  const subId = typeof subRef === 'string' ? subRef : subRef?.id;
  if (!subId) return { order: null, created: false, email: null };

  const draft = await readPendingSubscriptionOrder(subId);
  if (!draft) return { order: null, created: false, email: null };

  const orderId = invoice.id as string;
  const email = draft.customer.email;
  const users = await readUsers();
  let user: any = users.find((u: any) => u.email === email);
  if (!user) {
    user = { email, name: draft.customer.name || null, orders: [] };
    users.push(user);
  }
  if (!user.orders) user.orders = [];

  const existing = user.orders.find((o: any) => o.id === orderId || o.sessionId === orderId);
  if (existing) return { order: existing, created: false, email };

  const { order, carrier, provider, needsAddress } = makeOrderRecord(orderId, draft, {
    isSubscription: true,
    subscriptionId: subId,
  });
  // Reflect the amount Stripe actually charged for this cycle.
  if (typeof invoice.amount_paid === 'number' && invoice.amount_paid > 0) {
    order.totalAmount = invoice.amount_paid / 100;
  }
  order.billingReason = invoice.billing_reason || null;

  await autoBookShipment(order, carrier, provider, needsAddress, email);

  user.orders.push(order);
  await writeUsers(users);

  try {
    await sendNewOrderAdminNotification(order, email);
  } catch (e) {
    console.error(`Failed to send new-order notification for subscription order ${order.id}:`, e);
  }

  return { order, created: true, email };
}

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
