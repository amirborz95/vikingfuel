import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, readUsers } from '@/lib/auth';
import {
  getAffiliateByEmail,
  getOrCreateAffiliate,
  COMMISSION_PER_BOTTLE,
  COMMISSION_CURRENCY,
} from '@/lib/affiliates';

async function statsForCode(code: string) {
  const users = await readUsers();
  let orders = 0;
  let bottles = 0;
  let commission = 0;
  let sales = 0;
  const recent: any[] = [];
  users.forEach((u: any) => {
    (u.orders || []).forEach((o: any) => {
      if (o.affiliateCode === code) {
        orders += 1;
        bottles += o.affiliateBottles || 0;
        commission += o.affiliateCommission || 0;
        sales += o.totalAmount || 0;
        recent.push({
          id: o.id,
          date: o.createdAt,
          bottles: o.affiliateBottles || 0,
          commission: o.affiliateCommission || 0,
          total: o.totalAmount || 0,
        });
      }
    });
  });
  recent.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  return { orders, bottles, commission, sales, recent: recent.slice(0, 50) };
}

// GET: the logged-in user's affiliate link + stats (null if not an affiliate yet).
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const affiliate = await getAffiliateByEmail(user.email);
  const meta = { perBottle: COMMISSION_PER_BOTTLE, currency: COMMISSION_CURRENCY };
  if (!affiliate) return NextResponse.json({ affiliate: null, meta });

  const base = await statsForCode(affiliate.code);
  const paidOut = affiliate.paidOut || 0;
  const stats = { ...base, paidOut, available: Math.max(0, base.commission - paidOut) };
  return NextResponse.json({ affiliate, stats, meta });
}

// POST: create (or return) this user's affiliate link.
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const affiliate = await getOrCreateAffiliate(user.email, user.name || undefined);
  const base = await statsForCode(affiliate.code);
  const paidOut = affiliate.paidOut || 0;
  const stats = { ...base, paidOut, available: Math.max(0, base.commission - paidOut) };
  return NextResponse.json({
    affiliate,
    stats,
    meta: { perBottle: COMMISSION_PER_BOTTLE, currency: COMMISSION_CURRENCY },
  });
}
