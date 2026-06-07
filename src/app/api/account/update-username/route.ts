import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data/users.json');

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

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.name = newUsername.trim();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true, name: user.name });
  } catch (error: any) {
    console.error('Update username error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update username' },
      { status: 500 }
    );
  }
}
