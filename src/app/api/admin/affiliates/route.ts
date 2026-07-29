import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/auth';
import { readAffiliates, COMMISSION_PER_BOTTLE, COMMISSION_CURRENCY } from '@/lib/affiliates';

// Lists every affiliate with aggregated performance (for /admin/affiliate).
export async function GET(_req: NextRequest) {
  try {
    const [affiliates, users] = await Promise.all([readAffiliates(), readUsers()]);

    // Aggregate order stats per affiliate code in a single pass.
    const byCode: Record<string, { orders: number; bottles: number; commission: number; sales: number; lastOrder: string | null }> = {};
    users.forEach((u: any) => {
      (u.orders || []).forEach((o: any) => {
        const code = o.affiliateCode;
        if (!code) return;
        const s = (byCode[code] ||= { orders: 0, bottles: 0, commission: 0, sales: 0, lastOrder: null });
        s.orders += 1;
        s.bottles += o.affiliateBottles || 0;
        s.commission += o.affiliateCommission || 0;
        s.sales += o.totalAmount || 0;
        if (o.createdAt && (!s.lastOrder || new Date(o.createdAt) > new Date(s.lastOrder))) {
          s.lastOrder = o.createdAt;
        }
      });
    });

    const rows = affiliates
      .map((a) => ({
        code: a.code,
        email: a.email,
        name: a.name || null,
        createdAt: a.createdAt,
        link: `/${a.code}`,
        ...(byCode[a.code] || { orders: 0, bottles: 0, commission: 0, sales: 0, lastOrder: null }),
      }))
      .sort((x, y) => y.commission - x.commission);

    const totals = rows.reduce(
      (t, r) => ({
        affiliates: t.affiliates + 1,
        orders: t.orders + r.orders,
        bottles: t.bottles + r.bottles,
        commission: t.commission + r.commission,
        sales: t.sales + r.sales,
      }),
      { affiliates: 0, orders: 0, bottles: 0, commission: 0, sales: 0 }
    );

    return NextResponse.json({
      affiliates: rows,
      totals,
      meta: { perBottle: COMMISSION_PER_BOTTLE, currency: COMMISSION_CURRENCY },
    });
  } catch (error: any) {
    console.error('Admin affiliates error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
