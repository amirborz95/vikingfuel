import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAILS, getAuthenticatedUser } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const logsFile = path.join(dataDir, 'authLogs.json');

async function readJson(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser || !ADMIN_EMAILS.includes(authUser.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const logs = await readJson(logsFile);
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('Get logs error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
