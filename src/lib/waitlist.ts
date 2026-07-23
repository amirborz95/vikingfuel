'use server';

import { readData, writeData } from './store';

const WAITLIST_KEY = 'waitlist';

export async function readWaitlistEmails(): Promise<string[]> {
  return await readData<string[]>(WAITLIST_KEY, []);
}

export async function saveWaitlistEmail(email: string): Promise<string[]> {
  const emails = await readWaitlistEmails();
  const normalized = email.trim().toLowerCase();
  const uniqueEmails = Array.from(new Set([...emails.map((item) => item.toLowerCase()), normalized]));

  try {
    await writeData(WAITLIST_KEY, uniqueEmails);
  } catch (err) {
    console.error('Failed to save waitlist:', err);
  }

  return uniqueEmails;
}
