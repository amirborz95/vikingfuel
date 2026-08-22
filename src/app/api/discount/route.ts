import { NextRequest, NextResponse } from 'next/server';
import { resolveDiscount } from '@/lib/discount.server';

// Validates a discount/affiliate code for the checkout UI. The authoritative
// discount + affiliate attribution is re-computed server-side at payment time.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const d = await resolveDiscount(String(body.code || ''), items);
    return NextResponse.json({
      valid: d.valid,
      code: d.code,
      amount: d.amount,
      isAffiliate: !!d.isAffiliate,
      reason: d.reason || null,
    });
  } catch (e: any) {
    return NextResponse.json({ valid: false, amount: 0, error: e?.message || 'error' }, { status: 200 });
  }
}
