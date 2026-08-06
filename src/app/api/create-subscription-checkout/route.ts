import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ALLOWED_SUB_PRICE_IDS } from '@/lib/subscriptions';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

// Creates a Stripe-hosted Checkout Session in subscription mode. Stripe handles
// the recurring billing, payment method and (via the customer portal) cancellation.
export async function POST(req: NextRequest) {
  try {
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const body = await req.json();
    const priceId = String(body.priceId || '');
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));
    const email = String(body.email || '').trim();

    // Only allow our own subscription prices.
    if (!ALLOWED_SUB_PRICE_IDS.includes(priceId)) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
    }
    // Require a valid email — collected before redirecting to Stripe.
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Ange en giltig e-postadress.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      customer_email: email,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ['SE', 'NO', 'DK', 'FI'] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?subscription=1`,
      cancel_url: `${origin}/products`,
      metadata: { source: 'subscription-checkout', email },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('create-subscription-checkout error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to start subscription' }, { status: 500 });
  }
}
