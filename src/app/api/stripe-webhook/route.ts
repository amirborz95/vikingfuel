import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { saveOrderForSession } from '@/lib/orders';
import { sendOrderConfirmationEmailForSessionId } from '@/lib/orderConfirmation';

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

  return NextResponse.json({ received: true });
}
