import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  saveOrderForSession,
  finalizeOrderFromPaymentIntent,
  finalizeSubscriptionOrderFromInvoice,
} from '@/lib/orders';
import {
  sendOrderConfirmationEmailForSessionId,
  sendOrderConfirmationEmailForStoredOrder,
} from '@/lib/orderConfirmation';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-04-22.dahlia',
});

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

    // 1. Create the order record (idempotent — safe even if the success page already did).
    try {
      const result = await saveOrderForSession(sessionEvent.id);
      console.log(
        `Order ${result.created ? 'created' : 'already existed'} for session ${sessionEvent.id} (${result.email})`
      );
    } catch (e) {
      console.error('Failed to save order from webhook:', e);
    }

    // 2. Send the order confirmation email (PostNord label + shipping email happen at ship time).
    try {
      await sendOrderConfirmationEmailForSessionId(sessionEvent.id);
    } catch (e) {
      console.error('Failed to send order confirmation email:', e);
    }
  }

  // On-site subscriptions ("Prenumerera & spara 20%"): every paid invoice —
  // the first on-site confirmation and each monthly renewal — creates a fresh
  // order + shipment and sends the order confirmation email.
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    // Only act on subscription invoices.
    if (invoice.parent?.subscription_details?.subscription) {
      try {
        const result = await finalizeSubscriptionOrderFromInvoice(invoice);
        console.log(
          `Subscription order ${result.created ? 'created' : 'already existed'} for invoice ${invoice.id} (${result.email})`
        );
        if (result.created && result.order && result.email) {
          try {
            await sendOrderConfirmationEmailForStoredOrder(result.order, result.email);
          } catch (e) {
            console.error('Failed to send subscription order confirmation email:', e);
          }
        }
      } catch (e) {
        console.error('Failed to finalize subscription order from invoice:', e);
      }
    }
  }

  // On-site (embedded) checkout: order is finalized when the PaymentIntent succeeds.
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    try {
      const result = await finalizeOrderFromPaymentIntent(pi.id);
      console.log(
        `PI order ${result.created ? 'created' : 'already existed'} for ${pi.id} (${result.email})`
      );
      if (result.created && result.order && result.email) {
        try {
          await sendOrderConfirmationEmailForStoredOrder(result.order, result.email);
        } catch (e) {
          console.error('Failed to send PI order confirmation email:', e);
        }
      }
    } catch (e) {
      console.error('Failed to finalize order from payment intent:', e);
    }
  }

  return NextResponse.json({ received: true });
}
