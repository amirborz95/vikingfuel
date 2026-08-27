import crypto from 'crypto';

/**
 * Shared admin gate. The admin panel unlocks with this password and sends it
 * with every request that reads or changes customer data.
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PANEL_PASSWORD || 'Viking2026Fuel!';

export function isAdminPassword(value: unknown): boolean {
  const given = String(value ?? '');
  const expected = ADMIN_PASSWORD;
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/**
 * Shipping labels are opened as plain links (and PostNord labels are redirects),
 * so they can't carry a password body. Each order gets its own unguessable
 * token derived from the admin password instead — no secret ends up in the URL.
 */
export function labelToken(orderId: string): string {
  return crypto
    .createHmac('sha256', ADMIN_PASSWORD)
    .update(`label:${orderId}`)
    .digest('hex')
    .slice(0, 32);
}

export function verifyLabelToken(orderId: string, token: unknown): boolean {
  const given = String(token ?? '');
  const expected = labelToken(orderId);
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
