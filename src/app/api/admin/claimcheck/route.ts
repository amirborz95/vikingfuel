import { NextRequest, NextResponse } from 'next/server';
import { claimOnce } from '@/lib/dataStore';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

/**
 * Diagnostic: proves that concurrent callers get exactly one winner on the
 * live store (Netlify Blobs), which is what keeps a single order from booking
 * two PostNord labels or sending two owner emails.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (String(body.password || '') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Fel lösenord' }, { status: 403 });
  }

  const key = `diag_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const results = await Promise.all([claimOnce(key), claimOnce(key), claimOnce(key)]);
  const second = await claimOnce(key);

  return NextResponse.json({
    key,
    concurrent: results,
    winners: results.filter(Boolean).length,
    laterAttempt: second,
    ok: results.filter(Boolean).length === 1 && second === false,
  });
}
