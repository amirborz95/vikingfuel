// Server-side discount resolver. Handles both the static promo codes (VIKING10)
// and per-affiliate codes: when a customer enters an affiliate's code in the
// discount box they get AFFILIATE_DISCOUNT_PERCENT off AND the affiliate is
// credited their commission. Imports the affiliates store, so SERVER ONLY.

import { computeDiscount, type DiscountItem, type DiscountResult } from './discount';
import { getAffiliateByCode } from './affiliates';

export const AFFILIATE_DISCOUNT_PERCENT = 10; // % off the whole order for affiliate codes

export interface ResolvedDiscount extends DiscountResult {
  affiliateCode?: string;
  isAffiliate?: boolean;
}

/** Resolve any code (static promo or affiliate) against the cart. Safe to call. */
export async function resolveDiscount(rawCode: string, items: DiscountItem[]): Promise<ResolvedDiscount> {
  const code = (rawCode || '').trim();
  if (!code) return { valid: false, code: '', amount: 0 };

  // 1) Static promo codes (e.g. VIKING10) — instant, no lookup.
  const stat = computeDiscount(code, items);
  if (stat.valid) return stat;

  // 2) Affiliate code → percentage off the whole order + attribution.
  const aff = await getAffiliateByCode(code);
  if (aff) {
    const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity || 1), 0);
    const amount = Math.round(subtotal * (AFFILIATE_DISCOUNT_PERCENT / 100) * 100) / 100;
    return { valid: amount > 0, code: aff.code, amount, affiliateCode: aff.code, isAffiliate: true };
  }

  // 3) Static code matched but wasn't applicable (e.g. bundle) — surface the reason.
  if (stat.reason) return stat;
  return { valid: false, code, amount: 0, reason: 'invalid' };
}
