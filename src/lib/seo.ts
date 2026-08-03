import { PRODUCTS, SITE_URL, absoluteUrl } from './catalog';

// ── schema.org structured data builders ──────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Viking Fuel',
    legalName: 'SmartVal Sverige AB',
    url: SITE_URL,
    logo: absoluteUrl('/assets/images/app_logo.png'),
    email: 'info@vikingfuel.se',
    sameAs: [
      'https://www.instagram.com/vikingfuel.se/',
      'https://www.facebook.com/vikingfuel.se',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Viking Fuel',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        image: absoluteUrl(p.image),
        brand: { '@type': 'Brand', name: 'Viking Fuel' },
        url: absoluteUrl(p.url),
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'SEK',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl(p.url),
        },
      },
    })),
  };
}
