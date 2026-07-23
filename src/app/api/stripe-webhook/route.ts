import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  sendOrderConfirmationEmailForSessionId,
  sendShippingNotificationForSessionId,
} from '@/lib/orderConfirmation';
import { createPostNordShipment } from '@/lib/postnord.server';
import { readUsers, writeUsers } from '@/lib/auth';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

function getShippingDetails(session: Stripe.Checkout.Session) {
  return (
    (session as any).shipping_details ||
    session.customer_details ||
    session.collected_information?.shipping_details ||
    null
  ) as { name?: string | null; phone?: string | null; address?: Stripe.Address | null } | null;
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-04-22.dahlia',
});

async function saveOrderToUser(email: string, session: Stripe.Checkout.Session) {
  try {
    const users = await readUsers();
    let user: any = users.find((u: any) => u.email === email);

    if (!user) {
      console.log(`User with email ${email} not found — creating a guest user entry`);
      user = { email, name: null, orders: [] };
      users.push(user);
    }

    if (!user.orders) {
      user.orders = [];
    }

    // Get session details including line items
    const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    // Calculate total amount
    const totalAmount = (session.amount_total || 0) / 100; // Convert from cents to SEK
    const shippingDetails = getShippingDetails(sessionWithItems);

    const order: any = {
      id: session.id,
      sessionId: session.id,
      items: sessionWithItems.line_items?.data.map((item: any) => ({
        name: item.description || item.price?.product,
        quantity: item.quantity,
        price: (item.price?.unit_amount || 0) / 100,
      })) || [],
      totalAmount,
      currency: session.currency?.toUpperCase() || 'SEK',
      status: 'completed',
      paymentMethod: session.payment_method_types?.[0] || 'card',
      billingAddress: session.customer_details || null,
      shippingAddress: {
        name: shippingDetails?.name || null,
        address: shippingDetails?.address || null,
      },
      shippingOption: session.metadata?.shipping_option_label || null,
      shippingPostcode: session.metadata?.shipping_postcode || null,
      postnordShipmentId: null,
      postnordLabelUrl: null,
      postnordLabelPdfUrl: null,
      postnordTracking: null,
      createdAt: new Date(session.created * 1000).toISOString(),
    };

    if (session.metadata?.shipping_option === 'postnord' && shippingDetails?.address) {
      try {
        console.log('📮 Creating PostNord shipment for order:', session.id);
        const shipment = await createPostNordShipment({
          orderId: session.id,
          packageDescription: `Order ${session.id}`,
          items: order.items,
          totalAmount,
          customerEmail: session.customer_email || '',
          shippingDetails,
        });

        if (shipment) {
          order.postnordShipmentId = shipment.shipmentId;
          order.postnordLabelUrl = shipment.labelUrl || null;
          order.postnordLabelPdfUrl = shipment.labelPdfUrl || null;
          order.postnordTracking = shipment.trackingNumber || null;

          console.log('✅ PostNord shipment created:', {
            sessionId: session.id,
            shipmentId: shipment.shipmentId,
            trackingNumber: shipment.trackingNumber,
            labelUrl: shipment.labelUrl,
          });

          // Update stripe session metadata with tracking and label info so emails can include it
          try {
            await stripe.checkout.sessions.update(session.id, {
              metadata: {
                ...(session.metadata || {}),
                postnord_shipment_id: shipment.shipmentId || '',
                postnord_tracking: shipment.trackingNumber || '',
                postnord_label_url: shipment.labelUrl || '',
                postnord_label_pdf_url: shipment.labelPdfUrl || '',
              },
            });
            console.log('📝 Stripe session metadata updated with PostNord info');
          } catch (e) {
            console.error('❌ Failed to update Stripe session metadata with PostNord info:', e);
          }
        } else {
          console.warn('⚠️ PostNord shipment creation returned null — check configuration');
        }
      } catch (shipmentError: any) {
        console.error('❌ PostNord shipment creation failed:', {
          error: shipmentError?.message || shipmentError,
          orderId: session.id,
          stack: shipmentError?.stack,
        });
      }
    } else {
      console.log('⏭️ Skipping PostNord shipment — not selected or missing address', {
        shippingOption: session.metadata?.shipping_option,
        hasAddress: !!shippingDetails?.address,
      });
    }

    user.orders.push(order);
    await writeUsers(users);
    console.log(`Order saved for user ${email}`);
  } catch (error: any) {
    console.error('Error saving order to user:', error);
  }
}

export async function POST(req: NextRequest) {
  if (!stripeSecret || !webhookSecret) {
    console.error('Stripe webhook is not configured');
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.error('Missing stripe signature');
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const rawBody = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), signature, webhookSecret);
  } catch (error: any) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  console.log('Stripe webhook event received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const sessionEvent = event.data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(sessionEvent.id, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    console.log('checkout.session.completed session:', session.id, 'shipping_option:', session.metadata?.shipping_option, 'customer_email:', session.customer_email);

    if (session.customer_email) {
      await saveOrderToUser(session.customer_email, session);

      try {
        await sendOrderConfirmationEmailForSessionId(session.id);
      } catch (e) {
        console.error('Failed to send order confirmation email:', e);
      }

      try {
        await sendShippingNotificationForSessionId(session.id);
      } catch (e) {
        console.error('Failed to send shipping notification:', e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
