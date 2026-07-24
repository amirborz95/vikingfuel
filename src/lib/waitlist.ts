'use server';

import { readData, writeData } from './dataStore';

const WAITLIST_FILE = 'waitlist.json';

export async function readWaitlistEmails(): Promise<string[]> {
  return readData<string[]>(WAITLIST_FILE, []);
}

export async function saveWaitlistEmail(email: string): Promise<string[]> {
  const emails = await readWaitlistEmails();
  const normalized = email.trim().toLowerCase();
  const uniqueEmails = Array.from(
    new Set([...emails.map((item) => item.toLowerCase()), normalized])
  );

  try {
    await writeData(WAITLIST_FILE, uniqueEmails);
  } catch (err) {
    console.error('Failed to save waitlist:', err);
  }

  return uniqueEmails;
}
