import { NextRequest, NextResponse } from 'next/server';
import { readWaitlistEmails, saveWaitlistEmail } from '@/lib/waitlist';

export async function GET() {
  try {
    const emails = await readWaitlistEmails();
    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read waitlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress' }, { status: 400 });
    }

    await saveWaitlistEmail(email);
    return NextResponse.json({ success: true, email });
  } catch (error: any) {
    console.error('Waitlist POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save email' }, { status: 500 });
  }
}
