import { NextRequest, NextResponse } from 'next/server';
import { createPostNordShipment, postnordServiceCode } from '@/lib/postnord.server';
import { orderWeightGrams } from '@/lib/shipping';

// TEMP gated — books a REAL PostNord test label so it can be inspected in the
// PostNord portal (confirms service code 30 = Home Small). Remove after.
export const dynamic = 'force-dynamic';

const ADMIN = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export async function GET(req: NextRequest) {
  if ((req.nextUrl.searchParams.get('key') || '') !== ADMIN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const bottles = Math.max(1, Math.min(6, Number(req.nextUrl.searchParams.get('bottles')) || 1));
  const weightG = orderWeightGrams(bottles);
  const serviceCode = postnordServiceCode('SE', weightG / 1000);

  try {
    const shipment = await createPostNordShipment({
      orderId: 'TEST-' + Date.now(),
      packageDescription: 'Testorder Home Small',
      items: [{ name: 'Viking Energy — Testo-support', quantity: bottles, price: 349, units: 1 }],
      totalAmount: 349 * bottles + 39,
      customerEmail: 'amirborzlaev@gmail.com',
      shippingDetails: {
        name: 'Amir Test',
        phone: '+46728889888',
        address: { line1: 'Mältarevägen 31', line2: '', postal_code: '34235', city: 'Alvesta', country: 'SE' },
      },
    });
    return NextResponse.json({
      booked: !!shipment,
      bottles,
      weightGrams: weightG,
      serviceCodeSent: serviceCode,
      serviceName: serviceCode === '30' ? 'Home Small' : serviceCode === '19' ? 'Collect' : serviceCode === '17' ? 'Home' : serviceCode,
      shipmentId: shipment?.shipmentId || null,
      tracking: shipment?.trackingNumber || null,
      labelUrl: shipment?.labelUrl || null,
    });
  } catch (e: any) {
    return NextResponse.json({ booked: false, serviceCodeSent: serviceCode, error: e?.message || String(e) }, { status: 500 });
  }
}
