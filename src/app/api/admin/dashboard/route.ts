import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { readSessions, readUsers, AuthLog } from '@/lib/auth';
import { readAnalytics } from '@/lib/analytics';

const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';
const dataDir = path.join(process.cwd(), 'data');
const logsFile = path.join(dataDir, 'authLogs.json');

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST with password in body.' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = String(body.password || '');

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Fel lösenord' }, { status: 403 });
    }

    const users = await readUsers();
    const logs = await readJson<AuthLog[]>(logsFile);
    const sessions = await readSessions();
    const analytics = await readAnalytics();

    const safeUsers = users.map((user) => ({ name: user.name, email: user.email }));
    const safeSessions = sessions.map((session) => ({
      email: session.email,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));

    const orderedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const totalLogins = logs.filter((entry) => entry.action === 'login').length;
    const totalRegistrations = logs.filter((entry) => entry.action === 'register').length;
    const uniqueLoginEmails = new Set(logs.filter((entry) => entry.action === 'login').map((entry) => entry.email)).size;

    const pageViews = analytics.filter((entry) => entry.type === 'page-view');
    const pageViewCounts = pageViews.reduce<Record<string, number>>((memo, entry) => {
      memo[entry.path] = (memo[entry.path] || 0) + 1;
      return memo;
    }, {});
    const pageViewUsers = pageViews.reduce<Record<string, number>>((memo, entry) => {
      memo[entry.email] = (memo[entry.email] || 0) + 1;
      return memo;
    }, {});

    const pageViewsByPage = Object.entries(pageViewCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const pageViewsByUser = Object.entries(pageViewUsers)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const countryCounts = pageViews.reduce<Record<string, number>>((memo, entry) => {
      if (!entry.country) {
        return memo;
      }
      memo[entry.country] = (memo[entry.country] || 0) + 1;
      return memo;
    }, {});

    const pageViewsByCountry = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const latestLogin = logs.filter((entry) => entry.action === 'login')[0]?.timestamp || null;
    const totalPageViews = pageViews.length;
    const uniquePages = new Set(pageViews.map((visit) => visit.path)).size;
    const uniquePageViewUsers = new Set(pageViews.map((visit) => visit.email)).size;
    const latestPageView = pageViews[0]?.timestamp || null;
    const geoPageViews = pageViews.filter((entry) => entry.country || entry.region || entry.city).length;
    const geoCountries = new Set(pageViews.filter((entry) => entry.country).map((entry) => entry.country)).size;

    const metrics = {
      totalUsers: safeUsers.length,
      totalLogins,
      totalRegistrations,
      activeSessions: safeSessions.length,
      uniqueLoginEmails,
      latestLogin,
      latestSession: safeSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || null,
      totalPageViews,
      uniquePages,
      uniquePageViewUsers,
      latestPageView,
      geoPageViews,
      geoCountries,
    };

    return NextResponse.json({
      users: safeUsers,
      logs: orderedLogs,
      sessions: safeSessions,
      metrics,
      pageViews: pageViews.slice(-20).reverse(),
      pageViewsByPage,
      pageViewsByUser,
      pageViewsByCountry,
    });
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
