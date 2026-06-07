import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data/users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')) as any[];
}

function writeUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, orders, ...profile } = user;
    return NextResponse.json({ user: profile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      postalCode,
      city,
      state,
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.firstName = String(firstName || '').trim();
    user.lastName = String(lastName || '').trim();
    user.phone = String(phone || '').trim();
    user.address = String(address || '').trim();
    user.postalCode = String(postalCode || '').trim();
    user.city = String(city || '').trim();
    user.state = String(state || '').trim();

    if (user.firstName || user.lastName) {
      user.name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    }

    writeUsers(users);

    const { password, orders, ...profile } = user;
    return NextResponse.json({ success: true, user: profile });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
