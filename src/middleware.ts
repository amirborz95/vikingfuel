import { NextRequest, NextResponse } from 'next/server';

// Affiliate link handler. Two shapes are supported:
//   /12345          — bare numeric code (generated codes)
//   /ref/HANNA      — named/custom codes, safe because it can't collide with pages
// The code is stored in a cookie for 30 days and the visitor is sent to the
// products page. Attribution is read from this cookie at checkout.
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const m = path.match(/^\/(\d{4,6})\/?$/) || path.match(/^\/ref\/([A-Za-z0-9_-]{3,16})\/?$/);
  if (!m) return NextResponse.next();

  const res = NextResponse.redirect(new URL('/products', req.url));
  res.cookies.set('vf_ref', m[1].toUpperCase(), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
  });
  return res;
}

export const config = {
  // Run only on bare numeric paths and /ref/<code>; skip static assets, api, _next, etc.
  matcher: ['/:code(\\d{4,6})', '/ref/:code*'],
};
