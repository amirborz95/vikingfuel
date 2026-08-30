import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/auth';
import { readAnalytics } from '@/lib/analytics';
import { buildAnalyticsSummary } from '@/lib/analyticsSummary';
import { readWaitlistEmails } from '@/lib/waitlist';
import { readSubscribers } from '@/lib/newsletter';
import { isAdminPassword } from '@/lib/adminAuth';

/** Marks this browser as ours, so its visits stay out of the customer numbers. */
const STAFF_COOKIE = 'vf_staff';
const STAFF_MAX_AGE = 60 * 60 * 24 * 365;

export async function GET() {
  return NextResponse.json({ error: 'Use POST with password in body.' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isAdminPassword(body.password)) {
      return NextResponse.json({ error: 'Fel lösenord' }, { status: 403 });
    }

    const users = await readUsers();
    const analytics = await readAnalytics();

    const safeUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      state: user.state || '',
      orderCount: (user.orders || []).length,
      latestOrder: (user.orders || []).slice(-1)[0]?.createdAt || null,
    }));

    const analyticsSummary = buildAnalyticsSummary(analytics);

    // Orders per range, so traffic can be read next to what it actually sold.
    const allOrders = users.flatMap((u: any) => (u.orders || []) as any[]);
    const ordersSince = (from: string | null) => {
      const list = from ? allOrders.filter((o) => o.createdAt && new Date(o.createdAt) >= new Date(from)) : allOrders;
      return {
        count: list.length,
        revenue: Math.round(list.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)),
      };
    };

    const totalOrders = allOrders.length;
    const metrics = {
      totalUsers: safeUsers.length,
      totalOrders,
      totalRevenue: Math.round(allOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)),
      totalPageViews: analyticsSummary.totalVisits,
      latestPageView: analyticsSummary.lastVisit,
      firstPageView: analyticsSummary.firstVisit,
    };

    const waitlistEmails = await readWaitlistEmails();
    const newsletterSubscribers = await readSubscribers();

    const staffExcluded = req.cookies.get(STAFF_COOKIE)?.value === '1';

    const res = NextResponse.json({
      users: safeUsers,
      metrics,
      analytics: analyticsSummary,
      staffExcluded: true,
      orderStats: {
        today: ordersSince(analyticsSummary.ranges.today.from),
        week: ordersSince(analyticsSummary.ranges.week.from),
        month: ordersSince(analyticsSummary.ranges.month.from),
        all: ordersSince(null),
      },
      waitlistEmails,
      newsletterSubscribers,
    });

    // Unlocking the panel is proof this is the owner's browser — from now on its
    // visits are recorded as internal and left out of the dashboard.
    if (!staffExcluded) {
      res.cookies.set(STAFF_COOKIE, '1', {
        maxAge: STAFF_MAX_AGE,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    }
    return res;
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
