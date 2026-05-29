import { NextRequest, NextResponse } from 'next/server';
import { appendAnalyticsVisit } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = String(body.path || '').trim();
    const page = String(body.page || path || 'Okänd sida').trim();
    const email = String(body.email || 'anonymous').trim() || 'anonymous';
    const country = body.country ? String(body.country).trim() : undefined;
    const region = body.region ? String(body.region).trim() : undefined;
    const city = body.city ? String(body.city).trim() : undefined;
    const latitude = typeof body.latitude === 'number' ? body.latitude : undefined;
    const longitude = typeof body.longitude === 'number' ? body.longitude : undefined;

    if (!path) {
      return NextResponse.json({ error: 'Path is required for analytics.' }, { status: 400 });
    }

    await appendAnalyticsVisit({
      type: 'page-view',
      page,
      path,
      email,
      timestamp: new Date().toISOString(),
      country,
      region,
      city,
      latitude,
      longitude,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics visit error:', err);
    return NextResponse.json({ error: 'Unable to record page visit.' }, { status: 500 });
  }
}
