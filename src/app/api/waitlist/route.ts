import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const dataDir = path.join(process.cwd(), 'data');
const waitlistFile = path.join(dataDir, 'waitlist.json');

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function GET() {
  try {
    const emails = await readJson<string[]>(waitlistFile);
    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read waitlist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress' }, { status: 400 });
    }

    const emails = await readJson<string[]>(waitlistFile);
    const uniqueEmails = Array.from(new Set(emails.map((value) => value.toLowerCase())));

    if (!uniqueEmails.includes(email)) {
      uniqueEmails.push(email);
      await fs.writeFile(waitlistFile, JSON.stringify(uniqueEmails, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true, email });
  } catch (error: any) {
    console.error('Waitlist POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save email' }, { status: 500 });
  }
}
