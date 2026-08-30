import { NextRequest, NextResponse } from 'next/server';
import { isAdminPassword } from '@/lib/adminAuth';

const STAFF_COOKIE = 'vf_staff';
const STAFF_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Turns "don't count my own visits" on or off for the browser that calls it.
 * The admin panel sets it automatically on unlock; this exists so it can be
 * switched back (e.g. to test that tracking still works).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!isAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Fel lösenord' }, { status: 403 });
  }

  const exclude = body.exclude !== false;
  const res = NextResponse.json({ success: true, excluded: exclude });

  if (exclude) {
    res.cookies.set(STAFF_COOKIE, '1', {
      maxAge: STAFF_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });
  } else {
    res.cookies.set(STAFF_COOKIE, '', { maxAge: 0, path: '/' });
  }
  return res;
}
