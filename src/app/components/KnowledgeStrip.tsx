import React from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/knowledge';

// Server component — links product pages into the knowledge base (internal links
// that help those pages rank) and keeps shoppers engaged with helpful content.
const FEATURED = [
  'varfor-viking-fuel',
  'vad-innehaller-viking-fuel',
  'vad-ar-testosteron',
  'zink-och-testosteron',
  'naturlig-energiboost',
  'viking-fuel-vs-energidryck',
];

export default function KnowledgeStrip() {
  const items = FEATURED.map((s) => ARTICLES.find((a) => a.slug === s)).filter(Boolean) as typeof ARTICLES;
  if (!items.length) return null;

  return (
    <section className="border-t border-border bg-muted/40 py-14">
      <div className="container-wide">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Kunskap & vanliga frågor</h2>
            <p className="mt-1 text-sm text-muted-foreground">Lär dig mer om energi, testosteron och ingredienserna bakom Viking Fuel.</p>
          </div>
          <Link href="/knowledge" className="hidden flex-shrink-0 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            Alla artiklar →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Link
              key={a.slug}
              href={`/knowledge/${a.slug}`}
              className="group rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/40"
            >
              <span className="text-sm font-semibold text-foreground group-hover:text-primary">{a.title}</span>
            </Link>
          ))}
        </div>
        <Link href="/knowledge" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline sm:hidden">
          Alla artiklar →
        </Link>
      </div>
    </section>
  );
}
