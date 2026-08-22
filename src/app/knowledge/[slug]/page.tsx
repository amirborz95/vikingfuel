import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { ARTICLES, getArticle, getRelated, CATEGORIES } from '@/lib/knowledge';
import { SITE_URL, absoluteUrl } from '@/lib/catalog';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Sidan saknas' };
  return {
    title: `${a.metaTitle || a.title} | Viking Fuel`,
    description: a.metaDescription,
    keywords: a.keywords,
    alternates: { canonical: `/knowledge/${a.slug}` },
    openGraph: { title: a.title, description: a.metaDescription, type: 'article' },
  };
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const cat = CATEGORIES.find((c) => c.key === a.category);
  const related = getRelated(a, 3);
  const url = `${SITE_URL}/knowledge/${a.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.metaDescription,
    author: { '@type': 'Organization', name: 'Viking Fuel' },
    publisher: {
      '@type': 'Organization',
      name: 'Viking Fuel',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/images/app_logo.png') },
    },
    mainEntityOfPage: url,
  };

  const faqSchema = a.faq && a.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: a.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kunskap', item: `${SITE_URL}/knowledge` },
      { '@type': 'ListItem', position: 2, name: a.title, item: url },
    ],
  };

  const schemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={schemas} />
      <AnnouncementBar />
      <Header />
      <main className="pt-24 pb-16">
        <article className="container-wide max-w-2xl">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/knowledge" className="hover:text-foreground">Kunskap</Link>
            {cat && (<><span>/</span><Link href="/knowledge" className="hover:text-foreground">{cat.label}</Link></>)}
          </nav>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{a.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{a.metaDescription}</p>

          {/* Body */}
          <div className="mt-8 space-y-5">
            {a.body.map((b, i) => {
              if (b.type === 'h2') return <h2 key={i} className="mt-8 text-2xl font-bold text-foreground">{b.text}</h2>;
              if (b.type === 'ul')
                return (
                  <ul key={i} className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
                    {b.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                );
              return <p key={i} className="text-lg leading-relaxed text-muted-foreground">{b.text}</p>;
            })}
          </div>

          {/* Product CTA */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-lg font-bold text-foreground">Vill du ha jämn energi och fokus i vardagen?</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Viking Fuel kombinerar beprövade adaptogener med zink som bidrar till en normal testosteronhalt —
              rent, koffeinfritt och tillverkat i EU. Fri frakt över 649 kr.
            </p>
            <Link href="/products" className="mt-4 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95">
              Handla Viking Fuel
            </Link>
          </div>

          {/* FAQ */}
          {a.faq && a.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">Vanliga frågor</h2>
              <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {a.faq.map((f, i) => (
                  <div key={i} className="p-5">
                    <p className="font-semibold text-foreground">{f.q}</p>
                    <p className="mt-1 text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground">Läs vidare</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/knowledge/${r.slug}`} className="rounded-xl border border-border bg-white p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    {r.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <p className="mt-12 text-xs text-muted-foreground">
            Informationen är allmän och ersätter inte medicinsk rådgivning. Kosttillskott ersätter inte en
            varierad kost och hälsosam livsstil. Rådgör med läkare vid ihållande besvär.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
