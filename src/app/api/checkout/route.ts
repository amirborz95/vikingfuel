import { NextRequest, NextResponse } from 'next/server';

// This site is a static export; the actual checkout handler runs in the
// Netlify Function at netlify/functions/checkout.js. A `force = true`
// redirect in netlify.toml routes /api/checkout to that function in
// production. This stub exists only so `next build` succeeds under
// `output: 'export'`.
export const dynamic = 'force-static';

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: 'Checkout API is served by a Netlify Function in production.' },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
