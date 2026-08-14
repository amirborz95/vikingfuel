import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { readUsers, writeUsers } from '@/lib/auth';
import { UPSELL } from '@/lib/upsell';

// TEMP gated backfill — repairs an order whose upsell charge succeeded in Stripe
// but was never written to the order (the pre-fix race). Remove after use.
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const ADMIN = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  if ((req.nextUrl.searchParams.get('key') || '') !== ADMIN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const pi = req.nextUrl.searchParams.get('pi') || '';

  // Only proceed if a real upsell charge succeeded in Stripe for this order.
  let succeeded: Stripe.PaymentIntent[] = [];
  try {
    const found = await stripe.paymentIntents.search({ query: `metadata['original_pi']:'${pi}'` });
    succeeded = found.data.filter((u) => u.status === 'succeeded');
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
  if (!succeeded.length) {
    return NextResponse.json({ applied: false, reason: 'no succeeded upsell charge found' });
  }
  const upsellTotal = succeeded.reduce((s, u) => s + u.amount / 100, 0);
  const bottles = Math.round(upsellTotal / UPSELL.pricePerBottle);

  const users = await readUsers();
  for (const u of users) {
    const order = (u.orders || []).find((o: any) => o.id === pi || o.sessionId === pi);
    if (order) {
      if (order.upsellCharged) {
        return NextResponse.json({ applied: false, reason: 'already applied', total: order.totalAmount });
      }
      order.items = order.items || [];
      order.items.push({ name: `${UPSELL.productName} (upsell)`, quantity: bottles, price: UPSELL.pricePerBottle, units: 1 });
      order.totalAmount = Math.round(((order.totalAmount || 0) + upsellTotal) * 100) / 100;
      order.upsellCharged = true;
      await writeUsers(users);
      return NextResponse.json({ applied: true, upsellTotal, bottles, newTotal: order.totalAmount, items: order.items });
    }
  }
  return NextResponse.json({ applied: false, reason: 'order not found in store' });
}
