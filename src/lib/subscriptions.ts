// Subscription plans — "Prenumerera & spara 20%". Recurring monthly Stripe
// prices (created in the live account). Price IDs are public (they appear in
// client code), so hardcoded defaults are fine with env override.

export interface SubPlan {
  priceId: string;
  monthly: number; // SEK/month
}

// Keyed by number of bottles (pack size).
export const SUB_PLANS: Record<number, SubPlan> = {
  1: { priceId: process.env.NEXT_PUBLIC_STRIPE_SUB_PRICE_ID_1 || 'price_1U0JeWCSrSFxlcosTCb40TfV', monthly: 279 },
  3: { priceId: process.env.NEXT_PUBLIC_STRIPE_SUB_PRICE_ID_3 || 'price_1U0JeXCSrSFxlcosEU2WrRlg', monthly: 754 },
  6: { priceId: process.env.NEXT_PUBLIC_STRIPE_SUB_PRICE_ID_6 || 'price_1U0JeXCSrSFxlcos8ce8ULL3', monthly: 1339 },
};

export const ALLOWED_SUB_PRICE_IDS = Object.values(SUB_PLANS).map((p) => p.priceId);

export function subPlanForUnits(units: number): SubPlan | undefined {
  return SUB_PLANS[units];
}
