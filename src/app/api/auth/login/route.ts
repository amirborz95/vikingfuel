import { NextRequest, NextResponse } from 'next/server';
import { appendAuthLog, comparePassword, createSession, findUserByEmail, sanitizeUser, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const account = await findUserByEmail(email);
    if (!account) {
      return NextResponse.json({ error: 'No account' }, { status: 400 });
    }

    const isValid = await comparePassword(password, account.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    const session = await createSession(email);
    const response = NextResponse.json({ success: true, user: sanitizeUser(account) });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    await appendAuthLog({ action: 'login', email, timestamp: new Date().toISOString() });
    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
