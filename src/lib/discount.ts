// ─────────────────────────────────────────────────────────────────────────
// DISCOUNT CODES
// VIKING10 = 10% off, but ONLY on the single bottle (1-pack). Bundles (3-pack,
// 6-pack) are already discounted, so the code does not apply to them.
// ─────────────────────────────────────────────────────────────────────────

export interface DiscountItem {
  price: number;
  quantity: number;
  units?: number;
}

export interface DiscountResult {
  valid: boolean;
  code: string;
  amount: number; // SEK to subtract from the order
  reason?: string; // why it didn't apply (for the customer)
}

const CODES: Record<string, { percent: number; singleBottleOnly: boolean; label: string }> = {
  VIKING10: { percent: 10, singleBottleOnly: true, label: '10% på enstaka flaska' },
};

/** Compute the discount for a code against the cart. Always safe to call. */
export function computeDiscount(rawCode: string, items: DiscountItem[]): DiscountResult {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) return { valid: false, code, amount: 0 };

  const rule = CODES[code];
  if (!rule) return { valid: false, code, amount: 0, reason: 'invalid' };

  // Base = the line-total of eligible items (single bottle = units 1).
  const eligible = items.filter((it) => (rule.singleBottleOnly ? (it.units ?? 1) === 1 : true));
  const base = eligible.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0);

  if (base <= 0) {
    return { valid: false, code, amount: 0, reason: 'not_applicable' };
  }

  const amount = Math.round(base * (rule.percent / 100) * 100) / 100;
  return { valid: true, code, amount };
}

export function isKnownCode(rawCode: string): boolean {
  return !!CODES[(rawCode || '').trim().toUpperCase()];
}
