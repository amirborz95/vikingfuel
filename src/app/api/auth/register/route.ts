import { NextRequest, NextResponse } from 'next/server';
import { appendAuthLog, createSession, createUser, findUserByEmail, hashPassword, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'User exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    await createUser(name, email, hashedPassword);

    const session = await createSession(email);
    const response = NextResponse.json({ success: true, user: { name, email } });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    await appendAuthLog({ action: 'register', email, timestamp: new Date().toISOString() });
    return response;
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
