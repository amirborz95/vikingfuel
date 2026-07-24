import { NextRequest, NextResponse } from 'next/server';
import { readSubscribers, addSubscriber } from '@/lib/newsletter';

export async function GET() {
  try {
    const subscribers = await readSubscribers();
    return NextResponse.json({ subscribers });
  } catch (error: any) {
    console.error('Newsletter GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read subscribers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Ange en giltig e-postadress.' }, { status: 400 });
    }

    const { added } = await addSubscriber(email);
    return NextResponse.json({
      success: true,
      alreadySubscribed: !added,
      message: added
        ? 'Tack för att du prenumererar!'
        : 'Du prenumererar redan – tack!',
    });
  } catch (error: any) {
    console.error('Newsletter POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to subscribe' }, { status: 500 });
  }
}
