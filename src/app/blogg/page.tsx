import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blogg — energi, kosttillskott & vitalitet | Viking Fuel',
  description:
    'Tips och guider om energi, kosttillskott och vitalitet. Varför du blir trött på eftermiddagen, energi utan koffein och naturliga sätt att öka uthålligheten.',
  alternates: { canonical: '/blogg' },
};

export default function BloggPage() {
  const posts = [...POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-wide max-w-3xl">
          <p className="section-label">Blogg</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Energi, kosttillskott & vitalitet</h1>
          <p className="mt-3 text-muted-foreground">Guider om exakt det du googlar — energi, trötthet och naturliga tillskott.</p>

          <div className="mt-10 space-y-6">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blogg/${p.slug}`}
                className="block rounded-2xl border border-border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-product-hover"
              >
                <p className="text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleDateString('sv-SE')} · {p.readingMinutes} min läsning
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">{p.title}</h2>
                <p className="mt-2 text-muted-foreground">{p.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-primary">Läs mer →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
