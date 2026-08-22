import { MetadataRoute } from 'next';
import { POSTS } from '@/lib/blog';
import { ARTICLES } from '@/lib/knowledge';

// Required for static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${base}/products`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/product-detail`, lastModified: now, priority: 0.8 },
    { url: `${base}/blogg`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${base}/knowledge`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/testo-support`, lastModified: now, priority: 0.8 },
    { url: `${base}/testo-support-3-pack`, lastModified: now, priority: 0.7 },
    { url: `${base}/testo-support-6-pack`, lastModified: now, priority: 0.7 },
    { url: `${base}/about`, lastModified: now, priority: 0.5 },
    { url: `${base}/reviews`, lastModified: now, priority: 0.5 },
    { url: `${base}/faq`, lastModified: now, priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, priority: 0.4 },
    { url: `${base}/frakt-leverans`, lastModified: now, priority: 0.3 },
    { url: `${base}/returpolicy`, lastModified: now, priority: 0.3 },
    { url: `${base}/kopvillkor`, lastModified: now, priority: 0.3 },
    { url: `${base}/integritetspolicy`, lastModified: now, priority: 0.3 },
    { url: `${base}/affiliate`, lastModified: now, priority: 0.4 },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${base}/blogg/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  const knowledgePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/knowledge/${a.slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: 'monthly',
  }));

  return [...staticPages, ...blogPages, ...knowledgePages];
}
