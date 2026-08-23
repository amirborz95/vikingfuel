import { readData, writeData } from './dataStore';
import { totalUnits } from './inventory';

// ─────────────────────────────────────────────────────────────────────────
// AFFILIATE PROGRAM
// Codes are NOT self-service: a person applies by email (info@vikingfuel.se) or
// Instagram DM, and we create + activate their code manually in /admin/affiliate.
// Affiliates share vikingfuel.se/<code> (or /ref/<code>); every bottle sold
// through their link/code earns COMMISSION_PER_BOTTLE. 3-pack = 3 bottles.
// ─────────────────────────────────────────────────────────────────────────

export const COMMISSION_PER_BOTTLE = 50; // SEK per bottle sold
export const COMMISSION_CURRENCY = 'SEK';

export const AFFILIATE_CONTACT_EMAIL = 'info@vikingfuel.se';
export const AFFILIATE_INSTAGRAM_URL = 'https://www.instagram.com/vikingfuel.se/';
export const AFFILIATE_INSTAGRAM_HANDLE = '@vikingfuel.se';

export type AffiliateStatus = 'active' | 'paused';

export interface Affiliate {
  code: string;
  email: string;
  name?: string;
  instagram?: string;
  note?: string;
  status?: AffiliateStatus; // undefined = active (legacy rows)
  createdAt: string;
  paidOut?: number; // total SEK already paid out to this affiliate
}

const FILE = 'affiliates.json';

/** Codes are stored uppercase without spaces so lookups are case-insensitive. */
export function normalizeCode(code: string): string {
  return String(code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
}

export function isActive(a: Affiliate | undefined): boolean {
  return !!a && (a.status || 'active') === 'active';
}

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
  const wanted = normalizeCode(code);
  if (!wanted) return undefined;
  return list.find((a) => normalizeCode(a.code) === wanted);
}

/** A fresh 5-digit code that no existing affiliate uses (works with /<code> links). */
function generateNumericCode(list: Affiliate[]): string {
  let code = '';
  do {
    code = String(Math.floor(10000 + Math.random() * 90000));
  } while (list.some((a) => normalizeCode(a.code) === code));
  return code;
}

export interface CreateAffiliateInput {
  email: string;
  name?: string;
  code?: string; // optional custom code, otherwise a 5-digit one is generated
  instagram?: string;
  note?: string;
}

/**
 * Admin-only: create + activate an affiliate. Throws on duplicate code/email so
 * the admin UI can show a clear message.
 */
export async function createAffiliate(input: CreateAffiliateInput): Promise<Affiliate> {
  const list = await readAffiliates();
  const email = String(input.email || '').trim();
  if (!email || !email.includes('@')) throw new Error('Ogiltig e-postadress.');

  if (list.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Den e-postadressen har redan en affiliate-kod.');
  }

  let code = normalizeCode(input.code || '');
  if (code) {
    if (code.length < 3 || code.length > 16) throw new Error('Koden måste vara 3–16 tecken.');
    if (list.some((a) => normalizeCode(a.code) === code)) throw new Error('Koden är redan tagen.');
  } else {
    code = generateNumericCode(list);
  }

  const affiliate: Affiliate = {
    code,
    email,
    name: input.name?.trim() || undefined,
    instagram: input.instagram?.trim().replace(/^@/, '') || undefined,
    note: input.note?.trim() || undefined,
    status: 'active',
    createdAt: new Date().toISOString(),
    paidOut: 0,
  };
  list.push(affiliate);
  await writeAffiliates(list);
  return affiliate;
}

export async function setAffiliateStatus(code: string, status: AffiliateStatus): Promise<Affiliate | null> {
  const list = await readAffiliates();
  const a = list.find((x) => normalizeCode(x.code) === normalizeCode(code));
  if (!a) return null;
  a.status = status;
  await writeAffiliates(list);
  return a;
}

/** Remove one affiliate. Past orders keep their recorded commission. */
export async function deleteAffiliate(code: string): Promise<boolean> {
  const list = await readAffiliates();
  const next = list.filter((a) => normalizeCode(a.code) !== normalizeCode(code));
  if (next.length === list.length) return false;
  await writeAffiliates(next);
  return true;
}

/** Wipe the whole affiliate list (admin "ta bort alla"). Returns how many were removed. */
export async function deleteAllAffiliates(): Promise<number> {
  const list = await readAffiliates();
  await writeAffiliates([]);
  return list.length;
}

/** Commission (SEK) for a set of order items, based on total bottles. */
export function commissionForItems(items: Array<{ quantity: number; units?: number }>): number {
  return totalUnits(items) * COMMISSION_PER_BOTTLE;
}

/** Record that `amount` SEK has been paid out to an affiliate (sets the total). */
export async function setAffiliatePaidOut(code: string, amount: number): Promise<Affiliate | null> {
  const list = await readAffiliates();
  const a = list.find((x) => normalizeCode(x.code) === normalizeCode(code));
  if (!a) return null;
  a.paidOut = Math.max(0, Math.round(amount));
  await writeAffiliates(list);
  return a;
}
