import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, newUsername } = await req.json();

    if (!email || !newUsername || typeof newUsername !== 'string') {
      return NextResponse.json(
        { error: 'Email and new username are required' },
        { status: 400 }
      );
    }

    if (newUsername.trim().length < 2) {
      return NextResponse.json(
        { error: 'Username must be at least 2 characters' },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.name = newUsername.trim();
    await writeUsers(users);

    return NextResponse.json({ success: true, name: user.name });
  } catch (error: any) {
    console.error('Update username error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update username' },
      { status: 500 }
    );
  }
}
