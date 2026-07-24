import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmailForSessionId } from '@/lib/orderConfirmation';
import { saveOrderForSession } from '@/lib/orders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = String(body.sessionId || '').trim();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Ensure the order exists even if the Stripe webhook was delayed or failed.
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
