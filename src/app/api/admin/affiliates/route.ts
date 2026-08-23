import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/auth';
import {
  readAffiliates,
  setAffiliatePaidOut,
  setAffiliateStatus,
  createAffiliate,
  deleteAffiliate,
  deleteAllAffiliates,
  isActive,
  normalizeCode,
  COMMISSION_PER_BOTTLE,
  COMMISSION_CURRENCY,
} from '@/lib/affiliates';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

function unauthorized() {
  return NextResponse.json({ error: 'Fel lösenord' }, { status: 403 });
}

// Total commission earned by an affiliate code across all orders.
async function commissionForCode(code: string): Promise<number> {
  const users = await readUsers();
  const wanted = normalizeCode(code);
  let total = 0;
  users.forEach((u: any) => (u.orders || []).forEach((o: any) => {
    if (o.affiliateCode && normalizeCode(o.affiliateCode) === wanted) total += o.affiliateCommission || 0;
  }));
  return total;
}

/** Every affiliate with aggregated performance (for /admin/affiliate). */
async function buildList() {
  const [affiliates, users] = await Promise.all([readAffiliates(), readUsers()]);

  // Aggregate order stats per affiliate code in a single pass.
  const byCode: Record<string, { orders: number; bottles: number; commission: number; sales: number; lastOrder: string | null }> = {};
  users.forEach((u: any) => {
    (u.orders || []).forEach((o: any) => {
      if (!o.affiliateCode) return;
      const code = normalizeCode(o.affiliateCode);
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
      const s = byCode[normalizeCode(a.code)] || { orders: 0, bottles: 0, commission: 0, sales: 0, lastOrder: null };
      const paidOut = a.paidOut || 0;
      const numeric = /^\d{4,6}$/.test(a.code);
      return {
        code: a.code,
        email: a.email,
        name: a.name || null,
        instagram: a.instagram || null,
        note: a.note || null,
        status: a.status || 'active',
        active: isActive(a),
        createdAt: a.createdAt,
        link: numeric ? `/${a.code}` : `/ref/${a.code}`,
        ...s,
        paidOut,
        unpaid: Math.max(0, s.commission - paidOut),
      };
    })
    .sort((x, y) => y.unpaid - x.unpaid || new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());

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

  return {
    affiliates: rows,
    totals,
    meta: { perBottle: COMMISSION_PER_BOTTLE, currency: COMMISSION_CURRENCY },
  };
}

// Reading the list exposes affiliate emails, so it's password-gated too.
export async function GET() {
  return NextResponse.json({ error: 'Use POST with password in body.' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (String(body.password || '') !== ADMIN_PASSWORD) return unauthorized();

    const action = String(body.action || 'list');
    const code = String(body.code || '');

    switch (action) {
      case 'list':
        return NextResponse.json(await buildList());

      case 'create': {
        const affiliate = await createAffiliate({
          email: String(body.email || ''),
          name: body.name ? String(body.name) : undefined,
          code: body.code ? String(body.code) : undefined,
          instagram: body.instagram ? String(body.instagram) : undefined,
          note: body.note ? String(body.note) : undefined,
        });
        return NextResponse.json({ success: true, affiliate, ...(await buildList()) });
      }

      case 'markPaid': {
        if (!code) return NextResponse.json({ error: 'Kod saknas' }, { status: 400 });
        const total = await commissionForCode(code);
        const updated = await setAffiliatePaidOut(code, total);
        if (!updated) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        return NextResponse.json({ success: true, ...(await buildList()) });
      }

      case 'setStatus': {
        const status = body.status === 'paused' ? 'paused' : 'active';
        const updated = await setAffiliateStatus(code, status);
        if (!updated) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        return NextResponse.json({ success: true, ...(await buildList()) });
      }

      case 'delete': {
        const ok = await deleteAffiliate(code);
        if (!ok) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
        return NextResponse.json({ success: true, ...(await buildList()) });
      }

      case 'deleteAll': {
        const removed = await deleteAllAffiliates();
        return NextResponse.json({ success: true, removed, ...(await buildList()) });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin affiliates POST error:', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 400 });
  }
}
