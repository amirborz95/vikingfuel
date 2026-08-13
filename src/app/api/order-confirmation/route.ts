import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  sendOrderConfirmationEmailForSessionId,
  sendOrderConfirmationEmailForStoredOrder,
} from '@/lib/orderConfirmation';
import {
  saveOrderForSession,
  finalizeOrderFromPaymentIntent,
  finalizeSubscriptionOrderFromInvoice,
} from '@/lib/orders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentIntentId = String(body.paymentIntentId || '').trim();
    const sessionId = String(body.sessionId || '').trim();
    const subscriptionId = String(body.subscriptionId || '').trim();

    // On-site subscription: finalize from the subscription's latest invoice.
    // Idempotent with the invoice.paid webhook (dedupes on invoice id).
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] });
      const invoice = sub.latest_invoice as Stripe.Invoice | null;
      if (invoice) {
        const result = await finalizeSubscriptionOrderFromInvoice(invoice);
        if (result.created && result.order && result.email) {
          try {
            await sendOrderConfirmationEmailForStoredOrder(result.order, result.email);
          } catch (e) {
            console.error('Subscription confirmation email failed:', e);
          }
        }
        return NextResponse.json({
          success: true,
          value: result.order?.totalAmount ?? null,
          currency: result.order?.currency || 'SEK',
          trustpilot: result.email
            ? { recipientEmail: result.email, recipientName: result.order?.shippingAddress?.name || '', referenceId: result.order?.id || subscriptionId }
            : null,
        });
      }
      return NextResponse.json({ success: true, value: null, currency: 'SEK' });
    }

    // On-site (embedded) checkout: finalize from the PaymentIntent.
    if (paymentIntentId) {
      const result = await finalizeOrderFromPaymentIntent(paymentIntentId);
      if (result.created && result.order && result.email) {
        try {
          await sendOrderConfirmationEmailForStoredOrder(result.order, result.email);
        } catch (e) {
          console.error('PI confirmation email failed:', e);
        }
      }
      return NextResponse.json({
        success: true,
        value: result.order?.totalAmount ?? null,
        currency: result.order?.currency || 'SEK',
        trustpilot: result.email
          ? { recipientEmail: result.email, recipientName: result.order?.shippingAddress?.name || '', referenceId: result.order?.id || paymentIntentId }
          : null,
      });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Legacy hosted-checkout flow.
    try {
      await saveOrderForSession(sessionId);
    } catch (e) {
      console.error('Order save on success page failed:', e);
    }

    const result = await sendOrderConfirmationEmailForSessionId(sessionId);
    if (result.skipped) {
      return NextResponse.json({ success: true, message: 'Orderbekräftelse har redan skickats.' });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Order confirmation email error:', error);
    return NextResponse.json({ error: error?.message || 'Kunde inte skicka orderbekräftelse.' }, { status: 500 });
  }
}
