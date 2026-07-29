import { readData, writeData } from './dataStore';
import { totalUnits } from './inventory';

// ─────────────────────────────────────────────────────────────────────────
// AFFILIATE PROGRAM
// Affiliates share a link vikingfuel.se/<code>. Every bottle sold through their
// link earns them COMMISSION_PER_BOTTLE. A 3-pack = 3 bottles, 6-pack = 6.
// ─────────────────────────────────────────────────────────────────────────

export const COMMISSION_PER_BOTTLE = 50; // SEK per bottle sold
export const COMMISSION_CURRENCY = 'SEK';

export interface Affiliate {
  code: string;
  email: string;
  name?: string;
  createdAt: string;
}

const FILE = 'affiliates.json';

export async function readAffiliates(): Promise<Affiliate[]> {
  return readData<Affiliate[]>(FILE, []);
}

export async function writeAffiliates(list: Affiliate[]): Promise<void> {
  await writeData(FILE, list);
}

export async function getAffiliateByEmail(email: string): Promise<Affiliate | undefined> {
  const list = await readAffiliates();
  return list.find((a) => a.email.toLowerCase() === (email || '').toLowerCase());
}

export async function getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
  const list = await readAffiliates();
  return list.find((a) => a.code === String(code));
}

/** Returns the caller's affiliate, creating one (with a fresh code) if needed. */
export async function getOrCreateAffiliate(email: string, name?: string): Promise<Affiliate> {
  const list = await readAffiliates();
  const existing = list.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  // Generate a unique 5-digit code.
  let code = '';
  do {
    code = String(Math.floor(10000 + Math.random() * 90000));
  } while (list.some((a) => a.code === code));

  const affiliate: Affiliate = { code, email, name, createdAt: new Date().toISOString() };
  list.push(affiliate);
  await writeAffiliates(list);
  return affiliate;
}

/** Commission (SEK) for a set of order items, based on total bottles. */
export function commissionForItems(items: Array<{ quantity: number; units?: number }>): number {
  return totalUnits(items) * COMMISSION_PER_BOTTLE;
}
