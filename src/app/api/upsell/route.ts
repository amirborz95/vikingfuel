import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { UPSELL, UPSELL_TOTAL, UPSELL_TOTAL_CENTS } from '@/lib/upsell';
import { readUsers, writeUsers } from '@/lib/auth';
import { savePendingUpsell } from '@/lib/orders';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

// One-click post-purchase upsell: charges the card saved on the original
// PaymentIntent (off_session) — the customer doesn't re-enter payment details.
export async function POST(req: NextRequest) {
  try {
    if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

    const body = await req.json();
    const originalPiId = String(body.paymentIntentId || '');
    if (!originalPiId) return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 });

    const original = await stripe.paymentIntents.retrieve(originalPiId);
    if (original.status !== 'succeeded') {
      return NextResponse.json({ error: 'Original payment not completed' }, { status: 400 });
    }

    const customerId = typeof original.customer === 'string' ? original.customer : original.customer?.id;
    const paymentMethod = typeof original.payment_method === 'string' ? original.payment_method : original.payment_method?.id;
    if (!customerId || !paymentMethod) {
      return NextResponse.json({ error: 'no_saved_card', message: 'Kunde inte hitta sparat kort.' }, { status: 400 });
    }

    // Idempotency: don't charge the upsell twice for the same order.
    if (original.metadata?.upsell_charged === 'true') {
      return NextResponse.json({ success: true, alreadyCharged: true });
    }

    let upsellPi: Stripe.PaymentIntent;
    try {
      upsellPi = await stripe.paymentIntents.create({
        amount: UPSELL_TOTAL_CENTS,
        currency: 'sek',
        customer: customerId,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
        receipt_email: original.receipt_email || undefined,
        description: `Vikingfuel upsell — ${UPSELL.bottles}x ${UPSELL.productName}`,
        metadata: { source: 'post-purchase-upsell', original_pi: originalPiId },
      });
    } catch (e: any) {
      // Card needs authentication (3DS) or was declined off_session.
      console.error('Upsell charge failed:', e?.message);
      return NextResponse.json(
        { error: 'charge_failed', message: e?.message || 'Betalningen kunde inte genomföras.' },
        { status: 402 }
      );
    }

    if (upsellPi.status !== 'succeeded') {
      return NextResponse.json({ error: 'not_succeeded', status: upsellPi.status }, { status: 402 });
    }

    // Mark the original PI so we never double-charge, and append the upsell to
    // the stored order so it appears in the admin/fulfilment.
    try {
      await stripe.paymentIntents.update(originalPiId, {
        metadata: { ...original.metadata, upsell_charged: 'true' },
      });
    } catch {}

    const upsellItem = { name: `${UPSELL.productName} (upsell)`, quantity: UPSELL.bottles, price: UPSELL.pricePerBottle, units: 1 };

    // Record the upsell durably first, so it's applied even if the order hasn't
    // been finalized yet (finalizeOrderFromPaymentIntent merges it on creation).
    try {
      await savePendingUpsell(originalPiId, { items: [upsellItem], total: UPSELL_TOTAL });
    } catch (e) {
      console.error('Failed to save pending upsell (non-fatal):', e);
    }

    // If the order already exists, append immediately (guarded so we never double-add).
    try {
      const users = await readUsers();
      let touched = false;
      for (const u of users) {
        const order = (u.orders || []).find((o: any) => o.id === originalPiId || o.sessionId === originalPiId);
        if (order && !order.upsellCharged) {
          order.items = order.items || [];
          order.items.push(upsellItem);
          order.totalAmount = Math.round(((order.totalAmount || 0) + UPSELL_TOTAL) * 100) / 100;
          order.upsellCharged = true;
          touched = true;
          break;
        }
      }
      if (touched) await writeUsers(users);
    } catch (e) {
      console.error('Failed to append upsell to order (non-fatal):', e);
    }

    return NextResponse.json({ success: true, amount: UPSELL_TOTAL });
  } catch (error: any) {
    console.error('upsell error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
