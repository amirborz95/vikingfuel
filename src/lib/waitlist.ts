'use server';

import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const tmpDir = os.tmpdir();
const dataPath = path.join(dataDir, 'waitlist.json');
const tmpPath = path.join(tmpDir, 'waitlist.json');

function getWaitlistFilePath(): string {
  try {
    fs.accessSync(dataDir, fs.constants.W_OK);
    return dataPath;
  } catch {
    return tmpPath;
  }
}

async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const raw = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return [] as unknown as T;
    }
    return [] as unknown as T;
  }
}

export async function readWaitlistEmails(): Promise<string[]> {
  const filePath = getWaitlistFilePath();
  return readJson<string[]>(filePath);
}

export async function saveWaitlistEmail(email: string): Promise<string[]> {
  const filePath = getWaitlistFilePath();
  const emails = await readJson<string[]>(filePath);
  const normalized = email.trim().toLowerCase();
  const uniqueEmails = Array.from(new Set([...emails.map((item) => item.toLowerCase()), normalized]));

  try {
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
    await fsPromises.writeFile(filePath, JSON.stringify(uniqueEmails, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save waitlist file:', err);
  }

  return uniqueEmails;
}
