import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAILS, getAuthenticatedUser, readAuthLogs } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser || !ADMIN_EMAILS.includes(authUser.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const logs = await readAuthLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('Get logs error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
