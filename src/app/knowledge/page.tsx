import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES, articlesByCategory, ARTICLES } from '@/lib/knowledge';
import { SITE_URL } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Kunskap — Energi, testosteron & kosttillskott | Viking Fuel',
  description:
    'Svar på det folk söker om energi, trötthet, testosteron, adaptogener och kosttillskott. Ärliga, användbara guider från Viking Fuel.',
  keywords: ['energi', 'testosteron', 'kosttillskott', 'adaptogener', 'trötthet', 'naturlig energi', 'viking fuel kunskap'],
  alternates: { canonical: '/knowledge' },
  openGraph: { title: 'Kunskap — Viking Fuel', description: 'Guider om energi, testosteron och kosttillskott.', type: 'website' },
};

export default function KnowledgePage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Viking Fuel — Kunskap',
    description: 'Guider om energi, trötthet, testosteron, adaptogener och kosttillskott.',
    url: `${SITE_URL}/knowledge`,
    hasPart: ARTICLES.map((a) => ({ '@type': 'Article', headline: a.title, url: `${SITE_URL}/knowledge/${a.slug}` })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={collectionSchema} />
      <AnnouncementBar />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-wide">
          {/* Hero */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Kunskap</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Allt om energi, testosteron & kosttillskott
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Ärliga, lättlästa svar på det du faktiskt googlar — om trötthet, naturlig energi, adaptogener,
              hormoner och hur du väljer tillskott som fungerar.
            </p>
          </div>

          {/* Categories */}
          <div className="mt-14 space-y-12">
            {CATEGORIES.map((cat) => {
              const items = articlesByCategory(cat.key);
              if (!items.length) return null;
              return (
                <section key={cat.key}>
                  <div className="mb-5">
                    <h2 className="text-2xl font-bold text-foreground">{cat.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/knowledge/${a.slug}`}
                        className="group flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-card"
                      >
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary">{a.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.metaDescription}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Läs mer
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-primary/5 p-8 text-center ring-1 ring-primary/15">
            <h2 className="text-2xl font-bold text-foreground">Redo att känna skillnaden?</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Viking Fuel kombinerar beprövade adaptogener med zink som bidrar till en normal testosteronhalt —
              rent, koffeinfritt och tillverkat i EU.
            </p>
            <Link href="/products" className="mt-6 inline-flex rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95">
              Handla Viking Fuel
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
