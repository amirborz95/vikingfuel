import { NextRequest, NextResponse } from 'next/server';

// Affiliate link handler: a path that is only digits (e.g. /12234) is treated
// as an affiliate code. We store it in a cookie for 30 days and send the
// visitor to the homepage. Attribution is read from this cookie at checkout.
export function middleware(req: NextRequest) {
  const m = req.nextUrl.pathname.match(/^\/(\d{4,6})\/?$/);
  if (!m) return NextResponse.next();

  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('vf_ref', m[1], {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
  });
  return res;
}

export const config = {
  // Run only on bare numeric paths; skip static assets, api, _next, etc.
  matcher: ['/:code(\\d{4,6})'],
};
