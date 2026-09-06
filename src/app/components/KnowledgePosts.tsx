'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FEATURED_POSTS } from '@/lib/featuredPosts';

export default function KnowledgePosts() {
  const { lang } = useLanguage();
  const en = lang === 'en';

  return (
    <section className="bg-muted/40 py-20 lg:py-24">
      <div className="container-wide">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">{en ? 'Knowledge' : 'Kunskap'}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {en ? 'Read our latest posts' : 'Läs våra senaste inlägg'}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {en
                ? 'Straight answers about energy, testosterone and what supplements actually do — written to be useful, not to sell.'
                : 'Raka svar om energi, testosteron och vad kosttillskott faktiskt gör — skrivet för att vara användbart, inte för att sälja.'}
            </p>
          </div>
          <Link
            href="/knowledge"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:bg-slate-50 sm:inline-flex"
          >
            {en ? 'View posts' : 'Visa inlägg'}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURED_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/knowledge/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition hover:-translate-y-1 hover:shadow-product-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {en ? post.categoryEn : post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold leading-snug text-foreground group-hover:text-primary">
                    {en ? post.titleEn : post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {en ? post.excerptEn : post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-primary">
                    <span>{en ? 'Read the post' : 'Läs inlägget'}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {post.minutes} {en ? 'min read' : 'min läsning'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-95"
          >
            {en ? 'View posts' : 'Visa inlägg'}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
