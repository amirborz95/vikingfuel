import { NextRequest, NextResponse } from 'next/server';
import { appendAuthLog, getAuthenticatedUser, removeSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    let email = '';

    if (token) {
      const user = await getAuthenticatedUser(req);
      email = user?.email || '';
      await removeSession(token);
    }

    if (!email) {
      const body = await req.json();
      email = String(body.email || '').trim().toLowerCase();
    }

    if (email) {
      await appendAuthLog({ action: 'logout', email, timestamp: new Date().toISOString() });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return response;
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
