import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/products`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/product-detail`, lastModified: new Date(), priority: 0.8 },
  ];
}
