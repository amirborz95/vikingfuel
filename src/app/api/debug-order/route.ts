import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// TEMP gated diagnostic — inspects a PaymentIntent + any upsell charge. Remove after.
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const ADMIN = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  if ((req.nextUrl.searchParams.get('key') || '') !== ADMIN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const pi = req.nextUrl.searchParams.get('pi') || '';
  const out: any = {};
  try {
    const p = await stripe.paymentIntents.retrieve(pi);
    out.original = { id: p.id, amount: p.amount / 100, status: p.status, receipt_email: p.receipt_email, metadata: p.metadata };
  } catch (e: any) {
    out.originalError = e?.message || String(e);
  }
  try {
    const found = await stripe.paymentIntents.search({ query: `metadata['original_pi']:'${pi}'` });
    out.upsells = found.data.map((u) => ({ id: u.id, amount: u.amount / 100, status: u.status, created: new Date(u.created * 1000).toISOString(), metadata: u.metadata }));
  } catch (e: any) {
    out.upsellSearchError = e?.message || String(e);
  }
  return NextResponse.json(out);
}
