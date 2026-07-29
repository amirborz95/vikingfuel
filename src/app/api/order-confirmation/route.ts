import { NextRequest, NextResponse } from 'next/server';
import {
  sendOrderConfirmationEmailForSessionId,
  sendOrderConfirmationEmailForStoredOrder,
} from '@/lib/orderConfirmation';
import { saveOrderForSession, finalizeOrderFromPaymentIntent } from '@/lib/orders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentIntentId = String(body.paymentIntentId || '').trim();
    const sessionId = String(body.sessionId || '').trim();

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
