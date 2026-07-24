import { readData, writeData } from './dataStore';

const FILE = 'newsletter.json';

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function readSubscribers(): Promise<Subscriber[]> {
  return readData<Subscriber[]>(FILE, []);
}

export async function addSubscriber(
  rawEmail: string
): Promise<{ added: boolean; total: number }> {
  const email = rawEmail.trim().toLowerCase();
  const list = await readSubscribers();

  if (list.some((s) => s.email.toLowerCase() === email)) {
    return { added: false, total: list.length };
  }

  list.push({ email, subscribedAt: new Date().toISOString() });
  await writeData(FILE, list);
  return { added: true, total: list.length };
}
