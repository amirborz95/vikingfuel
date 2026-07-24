import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { readUsers, writeUsers } from '@/lib/auth';
import { createPostNordShipment } from '@/lib/postnord.server';
import { sendShippingNotificationForStoredOrder } from '@/lib/orderConfirmation';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2026-04-22.dahlia' }) : null;

const VALID_STATUSES = ['not_shipped', 'progress', 'shipped'];

export async function GET(req: NextRequest) {
  try {
    const users = await readUsers();

    const orders: Array<any> = [];
    users.forEach((u: any) => {
      (u.orders || []).forEach((o: any) => {
        orders.push({ userEmail: u.email, userName: u.name || null, order: o });
      });
    });

    // sort by createdAt desc
    orders.sort((a, b) => {
      const da = a.order?.createdAt ? new Date(a.order.createdAt).getTime() : 0;
      const db = b.order?.createdAt ? new Date(b.order.createdAt).getTime() : 0;
      return db - da;
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read orders' }, { status: 500 });
  }
}

/**
 * Update an order's shipping status.
 * Body: { action?: 'setStatus', userEmail, orderId, status: 'not_shipped' | 'progress' | 'shipped' }
 *
 * The customer is emailed a shipping confirmation ONLY when an order first
 * transitions into "shipped". Other status changes are silent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userEmail, orderId } = body;
    const requestedStatus = String(body.status || '').trim();

    if (!userEmail || !orderId) {
      return NextResponse.json({ error: 'userEmail and orderId are required' }, { status: 400 });
    }
    if (action && action !== 'setStatus') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(requestedStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find((u: any) => u.email === userEmail);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const order = (user.orders || []).find((o: any) => o.id === orderId || o.sessionId === orderId);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const wasShipped = order.status === 'shipped';
    order.status = requestedStatus;

    let warning: string | null = null;
    let emailed = false;

    // Only act (label fallback + customer email) on the transition INTO shipped.
    if (requestedStatus === 'shipped' && !wasShipped) {
      if (!order.shippedAt) order.shippedAt = new Date().toISOString();

      const isPostNord = String(order.shippingOption || '').toLowerCase().includes('postnord');

      // Fallback: if the PostNord label wasn't created at order time, create it now.
      if (isPostNord && !order.postnordShipmentId && order.shippingAddress?.address) {
        try {
          const shipment = await createPostNordShipment({
            orderId: order.id,
            packageDescription: `Order ${order.id}`,
            items: order.items || [],
            totalAmount: order.totalAmount || 0,
            customerEmail: user.email,
            shippingDetails: {
              name: order.shippingAddress?.name || user.name || 'Kund',
              phone: order.shippingAddress?.phone || order.billingAddress?.phone || '',
              address: order.shippingAddress?.address || null,
            },
          });
          if (shipment) {
            order.postnordShipmentId = shipment.shipmentId;
            order.postnordTracking = shipment.trackingNumber || order.postnordTracking || null;
            order.postnordLabelUrl = shipment.labelUrl || null;
            order.postnordLabelPdfUrl = shipment.labelPdfUrl || null;
          }
        } catch (e: any) {
          console.error('PostNord fallback booking failed:', e);
          warning = `PostNord-etikett kunde inte skapas: ${e?.message || e}`;
        }
      }

      // Email the customer their shipping confirmation (once).
      if (!order.shippingEmailSent) {
        try {
          await sendShippingNotificationForStoredOrder(order, user.email, order.postnordTracking);
          order.shippingEmailSent = true;
          emailed = true;
        } catch (e: any) {
          console.error('Failed to send shipping notification:', e);
          warning = (warning ? warning + ' ' : '') + `Statusen ändrades men e-post kunde inte skickas: ${e?.message || e}`;
        }
      }

      // Best-effort: reflect tracking in the Stripe session metadata.
      if (stripe && order.sessionId) {
        try {
          await stripe.checkout.sessions.update(order.sessionId, {
            metadata: {
              postnord_shipment_id: order.postnordShipmentId || '',
              postnord_tracking: order.postnordTracking || '',
              shipped: 'true',
            },
          });
        } catch (e) {
          console.error('Failed to update Stripe metadata on ship:', e);
        }
      }
    }

    await writeUsers(users);
    return NextResponse.json({ success: true, order, emailed, warning });
  } catch (error: any) {
    console.error('Admin orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
