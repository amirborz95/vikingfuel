import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/auth';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

// Opens the Stripe Billing customer portal so a subscriber can update payment,
// pause or cancel their subscription themselves. Matches the Stripe customer by
// the logged-in user's email.
export async function POST(req: NextRequest) {
  try {
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const found = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = found.data[0];
    if (!customer) {
      return NextResponse.json(
        { error: 'no_customer', message: 'Ingen prenumeration hittades för din e-post.' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se';

    try {
      const portal = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${origin}/`,
      });
      return NextResponse.json({ url: portal.url });
    } catch (e: any) {
      // Most common cause: the Billing customer portal hasn't been activated yet
      // in the Stripe dashboard (Settings → Billing → Customer portal).
      console.error('Billing portal error:', e?.message);
      return NextResponse.json(
        { error: 'portal_unconfigured', message: e?.message || 'Kundportalen är inte aktiverad i Stripe ännu.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('customer-portal error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
