import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (err: any) {
    console.error('Auth me error:', err);
    return NextResponse.json({ user: null });
  }
}
