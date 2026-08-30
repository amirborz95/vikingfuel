import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { appendAnalyticsVisit } from '@/lib/analytics';

const VISITOR_COOKIE = 'vf_vid';
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // a year

/** Rough device class from the user agent — enough for "mobile vs desktop". */
function deviceFrom(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|windows phone/.test(s)) return 'mobile';
  return 'desktop';
}

/** Where the visitor came from, as a readable source rather than a full URL. */
function referrerFrom(raw: string, host: string | null): string {
  const value = (raw || '').trim();
  if (!value) return 'Direkt';
  try {
    const url = new URL(value);
    if (host && url.hostname.replace(/^www\./, '') === host.replace(/^www\./, '')) {
      return 'Intern';
    }
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Direkt';
  }
}

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

    // Anonymous browser id, so the dashboard can count people and not just hits.
    const existingId = req.cookies.get(VISITOR_COOKIE)?.value;
    const visitorId = existingId && /^[a-f0-9-]{10,40}$/i.test(existingId) ? existingId : crypto.randomUUID();

    await appendAnalyticsVisit({
      type: 'page-view',
      page,
      path,
      email,
      visitorId,
      referrer: referrerFrom(String(body.referrer || ''), req.nextUrl.hostname),
      device: deviceFrom(req.headers.get('user-agent') || ''),
      timestamp: new Date().toISOString(),
      country,
      region,
      city,
      latitude,
      longitude,
    });

    const res = NextResponse.json({ success: true });
    if (!existingId) {
      res.cookies.set(VISITOR_COOKIE, visitorId, {
        maxAge: VISITOR_MAX_AGE,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    }
    return res;
  } catch (err: any) {
    console.error('Analytics visit error:', err);
    return NextResponse.json({ error: 'Unable to record page visit.' }, { status: 500 });
  }
}
