// Canonical product catalog used for SEO structured data and the Google
// Merchant feed. Keep prices in sync with the storefront.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vikingfuel.se').replace(/\/$/, '');

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number; // SEK
  oldPrice?: number;
  image: string; // absolute or site-relative
  url: string; // site-relative
  capsules: string;
  bottles: number;
}

export const PRODUCTS: CatalogProduct[] = [
  {
    id: 'viking-energy-1',
    name: 'Viking Fuel — Testo-support (1-pack)',
    description:
      'Naturligt kosttillskott för energi, uthållighet och vitalitet. 60 kapslar med Maca, Ashwagandha, Ginseng och zink. Tillverkat i EU utan onödiga tillsatser.',
    price: 349,
    image: '/assets/images/viking-energy-1e.png',
    url: '/products',
    capsules: '60 kapslar',
    bottles: 1,
  },
  {
    id: 'viking-energy-3',
    name: 'Viking Fuel — Testo-support (3-pack)',
    description:
      'Tre flaskor Viking Fuel — 180 kapslar för tre månaders energi och fokus. Naturliga ingredienser, tillverkat i EU. Spara jämfört med styckpris.',
    price: 942,
    oldPrice: 1047,
    image: '/assets/images/viking-energy-3e.png',
    url: '/products',
    capsules: '180 kapslar',
    bottles: 3,
  },
  {
    id: 'viking-energy-6',
    name: 'Viking Fuel — Testo-support (6-pack)',
    description:
      'Sex flaskor Viking Fuel — 360 kapslar, bästa värdet för långvarig energi, uthållighet och vitalitet. Naturliga ingredienser, tillverkat i EU.',
    price: 1674,
    oldPrice: 2094,
    image: '/assets/images/viking-energy-6e.png',
    url: '/products',
    capsules: '360 kapslar',
    bottles: 6,
  },
];

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}
