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

/**
 * Returns the shipping cost in SEK for a given method, destination country and
 * order subtotal. Pickup is only valid for Sweden and is always free.
 */
export function getShippingCost(
  method: ShippingMethod,
  country: string,
  subtotal: number
): number {
  if (method === 'pickup') return 0;
  const zone = getZone(country);
  const rate = SHIPPING_RATES[zone];
  if (rate.freeOver > 0 && subtotal >= rate.freeOver) return 0;
  return rate.price;
}
