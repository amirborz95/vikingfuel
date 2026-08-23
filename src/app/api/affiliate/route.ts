import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, readUsers } from '@/lib/auth';
import {
  getAffiliateByEmail,
  isActive,
  normalizeCode,
  COMMISSION_PER_BOTTLE,
  COMMISSION_CURRENCY,
  AFFILIATE_CONTACT_EMAIL,
  AFFILIATE_INSTAGRAM_URL,
  AFFILIATE_INSTAGRAM_HANDLE,
} from '@/lib/affiliates';

async function statsForCode(rawCode: string) {
  const users = await readUsers();
  const code = normalizeCode(rawCode);
  let orders = 0;
  let bottles = 0;
  let commission = 0;
  let sales = 0;
  const recent: any[] = [];
  users.forEach((u: any) => {
    (u.orders || []).forEach((o: any) => {
      if (o.affiliateCode && normalizeCode(o.affiliateCode) === code) {
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
  const meta = {
    perBottle: COMMISSION_PER_BOTTLE,
    currency: COMMISSION_CURRENCY,
    contactEmail: AFFILIATE_CONTACT_EMAIL,
    instagramUrl: AFFILIATE_INSTAGRAM_URL,
    instagramHandle: AFFILIATE_INSTAGRAM_HANDLE,
  };
  if (!affiliate) return NextResponse.json({ affiliate: null, meta });

  const base = await statsForCode(affiliate.code);
  const paidOut = affiliate.paidOut || 0;
  const stats = { ...base, paidOut, available: Math.max(0, base.commission - paidOut) };
  return NextResponse.json({ affiliate: { ...affiliate, active: isActive(affiliate) }, stats, meta });
}

// POST: codes are no longer self-service — people apply by email or Instagram DM
// and we activate their code manually in /admin/affiliate.
export async function POST() {
  return NextResponse.json(
    {
      error: 'manual_approval',
      message: `Affiliate-koder skapas manuellt. Mejla ${AFFILIATE_CONTACT_EMAIL} eller DM:a ${AFFILIATE_INSTAGRAM_HANDLE} på Instagram så fixar vi din kod.`,
      contactEmail: AFFILIATE_CONTACT_EMAIL,
      instagramUrl: AFFILIATE_INSTAGRAM_URL,
      instagramHandle: AFFILIATE_INSTAGRAM_HANDLE,
    },
    { status: 403 }
  );
}
