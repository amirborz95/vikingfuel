// ─────────────────────────────────────────────────────────────────────────
// SHIPPING CONFIG — edit these numbers to change shipping prices.
// All prices are in SEK. `freeOver` = free shipping at or above this subtotal
// (0 = never free). Sweden ships free over 700 kr; pickup is always free.
// International zones are placeholder PostNord estimates — adjust as needed.
// ─────────────────────────────────────────────────────────────────────────

export type Zone = 'se' | 'nordic' | 'eu' | 'europe' | 'world';

export const SHIPPING_RATES: Record<Zone, { price: number; freeOver: number }> = {
  se: { price: 49, freeOver: 700 },
  nordic: { price: 99, freeOver: 1500 },
  eu: { price: 149, freeOver: 1500 },
  europe: { price: 199, freeOver: 2000 },
  world: { price: 299, freeOver: 0 },
};

const NORDIC = ['NO', 'DK', 'FI', 'IS']; // Sweden itself is 'se'
const EU = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'EE', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
];
const EUROPE_NON_EU = [
  'GB', 'CH', 'NO', 'IS', 'UA', 'RS', 'ME', 'MK', 'AL', 'BA', 'MD', 'LI',
  'MC', 'SM', 'AD', 'VA', 'GI', 'FO', 'GL', 'TR',
];

export function getZone(country: string): Zone {
  const c = (country || '').toUpperCase();
  if (c === 'SE') return 'se';
  if (NORDIC.includes(c)) return 'nordic';
  if (EU.includes(c)) return 'eu';
  if (EUROPE_NON_EU.includes(c)) return 'europe';
  return 'world';
}

export type ShippingMethod = 'pickup' | 'postnord';

// ── Weight ────────────────────────────────────────────────────────────────
// Real weights supplied by the owner (with shipping box):
//   1 bottle = 170 g, 2 = 250 g, 3 = 327 g  → ≈ 95 g box + ~78 g per bottle.
// We approximate a bit high (95 g + 80 g/bottle) so we never under-declare to
// PostNord (under-declaring risks weight surcharges).
export function orderWeightGrams(totalBottles: number): number {
  if (!totalBottles || totalBottles <= 0) return 200;
  return 95 + 80 * totalBottles;
}

// Domestic (SE) PostNord price by parcel weight — cheap for the light orders we
// actually ship, scaling up only when the customer buys a lot (heavier parcel).
// Free over the SE `freeOver` subtotal (handled in getShippingCost).
const SE_WEIGHT_TIERS: { maxGrams: number; price: number }[] = [
  { maxGrams: 500, price: 39 },   // 1–5 bottles  (small parcel / home small)
  { maxGrams: 1000, price: 49 },  // 6–11 bottles
  { maxGrams: 3000, price: 69 },  // heavier order
  { maxGrams: 5000, price: 99 },
  { maxGrams: Infinity, price: 149 },
];

export function seShippingByWeight(totalBottles: number): number {
  const grams = orderWeightGrams(totalBottles);
  const tier = SE_WEIGHT_TIERS.find((t) => grams <= t.maxGrams) || SE_WEIGHT_TIERS[SE_WEIGHT_TIERS.length - 1];
  return tier.price;
}

/**
 * Returns the shipping cost in SEK for a given method, destination country,
 * order subtotal and (for Sweden) the number of bottles. Pickup is always free.
 * Domestic SE PostNord is priced by parcel weight; international stays zone-based.
 */
export function getShippingCost(
  method: ShippingMethod,
  country: string,
  subtotal: number,
  totalBottles = 0
): number {
  if (method === 'pickup') return 0;
  const zone = getZone(country);
  const rate = SHIPPING_RATES[zone];
  if (rate.freeOver > 0 && subtotal >= rate.freeOver) return 0;
  if (zone === 'se') return seShippingByWeight(totalBottles);
  return rate.price;
}
