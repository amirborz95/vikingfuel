import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ange en giltig e-postadress.' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('Missing GOOGLE_SHEETS_WEBHOOK_URL environment variable');
      return NextResponse.json(
        { error: 'Webbplatsen är inte rätt konfigurerad för att spara e-post.' },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source: 'newsletter',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Google Sheets webhook error', response.status, text);
      return NextResponse.json(
        { error: 'Kunde inte spara e-post just nu. Försök igen senare.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Något gick fel vid registreringen.' },
      { status: 500 }
    );
  }
}
