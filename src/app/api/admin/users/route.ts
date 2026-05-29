import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAILS, getAuthenticatedUser, readUsers } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser || !ADMIN_EMAILS.includes(authUser.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await readUsers();
    const safeUsers = users.map((u) => ({ name: u.name, email: u.email }));
    return NextResponse.json({ users: safeUsers });
  } catch (err: any) {
    console.error('Get users error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
