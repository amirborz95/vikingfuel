// ─────────────────────────────────────────────────────────────────────────
// CARRIER CATALOG — the delivery options shown at checkout.
//
// `pickup` and `postnord` keep their existing behaviour. The remaining
// carriers are booked through Shipmondo (one aggregator, many carriers). Their
// Shipmondo product codes are merchant-specific and come from env vars — look
// them up in the Shipmondo web portal or via the /products API endpoint, then
// set SHIPMONDO_PRODUCT_* accordingly. A carrier without a configured product
// code simply won't produce a label (the order is still created).
// ─────────────────────────────────────────────────────────────────────────

import { getShippingCost } from './shipping';

export type CarrierId = 'pickup' | 'postnord' | 'dhl' | 'earlybird' | 'budbee' | 'schenker';
export type CarrierProvider = 'pickup' | 'postnord' | 'shipmondo';

export interface CarrierDef {
  id: CarrierId;
  brand: string; // brand label shown to the customer (Swedish/default)
  brandEn?: string; // English label; only needed for non-proper-name brands
  provider: CarrierProvider;
  descSv: string;
  descEn: string;
  needsAddress: boolean;
  seOnly: boolean; // only offered when shipping to Sweden
  price: number; // base price in SEK (domestic)
  freeOver: number; // free at/above this subtotal (0 = never free)
  productEnv?: string; // env var holding the Shipmondo product_code
}

export const CARRIERS: CarrierDef[] = [
  {
    id: 'pickup',
    brand: 'Uthämtning',
    brandEn: 'Store pickup',
    provider: 'pickup',
    descSv: 'Hämta din order hos oss i Alvesta (Mältarevägen 31).',
    descEn: 'Collect your order from us in Alvesta (Mältarevägen 31).',
    needsAddress: false,
    seOnly: true,
    price: 0,
    freeOver: 0,
  },
  {
    id: 'postnord',
    brand: 'PostNord',
    provider: 'postnord',
    descSv: 'Levereras hem till dig på 2–4 arbetsdagar.',
    descEn: 'Delivered to your door in 2–4 business days.',
    needsAddress: true,
    seOnly: false,
    price: 49,
    freeOver: 700,
  },
  {
    id: 'dhl',
    brand: 'DHL',
    provider: 'shipmondo',
    descSv: 'DHL leverans, 1–3 arbetsdagar.',
    descEn: 'DHL delivery, 1–3 business days.',
    needsAddress: true,
    seOnly: false,
    price: 79,
    freeOver: 0,
    productEnv: 'SHIPMONDO_PRODUCT_DHL',
  },
  {
    id: 'earlybird',
    brand: 'Earlybird',
    provider: 'shipmondo',
    descSv: 'Snabb hemleverans i utvalda områden.',
    descEn: 'Fast home delivery in selected areas.',
    needsAddress: true,
    seOnly: true,
    price: 59,
    freeOver: 0,
    productEnv: 'SHIPMONDO_PRODUCT_EARLYBIRD',
  },
  {
    id: 'budbee',
    brand: 'Budbee / Instabox',
    provider: 'shipmondo',
    descSv: 'Hemleverans eller box, med tidsfönster.',
    descEn: 'Home delivery or locker, with time slots.',
    needsAddress: true,
    seOnly: true,
    price: 59,
    freeOver: 0,
    productEnv: 'SHIPMONDO_PRODUCT_BUDBEE',
  },
  {
    id: 'schenker',
    brand: 'DB Schenker',
    provider: 'shipmondo',
    descSv: 'Paketleverans till ombud eller dörr.',
    descEn: 'Parcel delivery to a service point or door.',
    needsAddress: true,
    seOnly: false,
    price: 89,
    freeOver: 0,
    productEnv: 'SHIPMONDO_PRODUCT_SCHENKER',
  },
];

export function getCarrier(id: string): CarrierDef | undefined {
  return CARRIERS.find((c) => c.id === id);
}

/** Localised brand label — English falls back to the default brand. */
export function carrierBrand(c: CarrierDef | undefined | null, en: boolean): string {
  if (!c) return '';
  return en && c.brandEn ? c.brandEn : c.brand;
}

/**
 * Carriers available for a given destination country.
 *
 * Shipmondo carriers (DHL, Earlybird, Budbee, DB Schenker) only appear once
 * Shipmondo is configured — set NEXT_PUBLIC_SHIPMONDO_ENABLED=true after adding
 * the API credentials + product codes. Until then only pickup + PostNord show,
 * so deploying this code changes nothing visible in the live store.
 */
export function availableCarriers(country: string): CarrierDef[] {
  const se = (country || 'SE').toUpperCase() === 'SE';
  const shipmondoEnabled = process.env.NEXT_PUBLIC_SHIPMONDO_ENABLED === 'true';
  return CARRIERS.filter((c) => {
    if (c.provider === 'shipmondo' && !shipmondoEnabled) return false;
    return se ? true : !c.seOnly;
  });
}

/**
 * Shipping cost in SEK for a carrier, destination, subtotal and bottle count.
 * PostNord (SE) is priced by parcel weight (derived from `totalBottles`); other
 * carriers keep their flat price with a free-over threshold.
 */
export function carrierCost(id: string, country: string, subtotal: number, totalBottles = 0): number {
  const c = getCarrier(id);
  if (!c) return 0;
  if (c.provider === 'pickup') return 0;
  // PostNord: weight-based domestic pricing, zone-based international.
  if (c.id === 'postnord') return getShippingCost('postnord', country, subtotal, totalBottles);
  if (c.price === 0) return 0;
  if (c.freeOver > 0 && subtotal >= c.freeOver) return 0;
  return c.price;
}
