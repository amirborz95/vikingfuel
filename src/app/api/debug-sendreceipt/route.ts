import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmailForStoredOrder } from '@/lib/orderConfirmation';

// TEMP — verifies the kvitto email works on production (pdf-lib + logo bundling).
// Gated by admin password. Remove after verifying.
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  if ((req.nextUrl.searchParams.get('key') || '') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const to = req.nextUrl.searchParams.get('to') || 'amirborzlaev@gmail.com';
  const sample = {
    id: 'TEST-' + Date.now(),
    isSubscription: false,
    items: [{ name: 'Viking Energy — Testo-support', quantity: 1, price: 349, units: 1 }],
    shippingCost: 39,
    totalAmount: 388,
    shippingOption: 'PostNord',
    carrier: 'postnord',
    carrierProvider: 'postnord',
    shippingAddress: {
      name: 'Amir',
      phone: '+46728889888',
      address: { line1: 'Testgatan 1', postal_code: '34235', city: 'Alvesta', country: 'SE' },
    },
  };
  try {
    await sendOrderConfirmationEmailForStoredOrder(sample, to);
    return NextResponse.json({ sent: true, to });
  } catch (e: any) {
    return NextResponse.json({ sent: false, error: e?.message || String(e) }, { status: 500 });
  }
}
