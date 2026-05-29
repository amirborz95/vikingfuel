import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmailForSessionId } from '@/lib/orderConfirmation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = String(body.sessionId || '').trim();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
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
