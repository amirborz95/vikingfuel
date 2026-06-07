import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data/users.json');

export async function POST(req: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Email, current password, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
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

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
