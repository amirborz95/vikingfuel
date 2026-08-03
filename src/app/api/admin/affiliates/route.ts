import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/auth';
import {
  readAffiliates,
  setAffiliatePaidOut,
  COMMISSION_PER_BOTTLE,
  COMMISSION_CURRENCY,
} from '@/lib/affiliates';

// Total commission earned by an affiliate code across all orders.
async function commissionForCode(code: string): Promise<number> {
  const users = await readUsers();
  let total = 0;
  users.forEach((u: any) => (u.orders || []).forEach((o: any) => {
    if (o.affiliateCode === code) total += o.affiliateCommission || 0;
  }));
  return total;
}

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
      .map((a) => {
        const s = byCode[a.code] || { orders: 0, bottles: 0, commission: 0, sales: 0, lastOrder: null };
        const paidOut = a.paidOut || 0;
        return {
          code: a.code,
          email: a.email,
          name: a.name || null,
          createdAt: a.createdAt,
          link: `/${a.code}`,
          ...s,
          paidOut,
          unpaid: Math.max(0, s.commission - paidOut),
        };
      })
      .sort((x, y) => y.unpaid - x.unpaid);

    const totals = rows.reduce(
      (t, r) => ({
        affiliates: t.affiliates + 1,
        orders: t.orders + r.orders,
        bottles: t.bottles + r.bottles,
        commission: t.commission + r.commission,
        paidOut: t.paidOut + r.paidOut,
        unpaid: t.unpaid + r.unpaid,
        sales: t.sales + r.sales,
      }),
      { affiliates: 0, orders: 0, bottles: 0, commission: 0, paidOut: 0, unpaid: 0, sales: 0 }
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

// Mark an affiliate as fully paid out (sets paidOut = total earned).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = String(body.code || '');
    if (body.action !== 'markPaid' || !code) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const total = await commissionForCode(code);
    const updated = await setAffiliatePaidOut(code, total);
    if (!updated) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    return NextResponse.json({ success: true, code, paidOut: updated.paidOut || 0 });
  } catch (error: any) {
    console.error('Admin affiliates POST error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
