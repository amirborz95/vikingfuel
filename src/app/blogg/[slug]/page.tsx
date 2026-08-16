import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { POSTS, getPost } from '@/lib/blog';
import { SITE_URL, absoluteUrl } from '@/lib/catalog';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Inlägg saknas' };
  return {
    title: `${post.title} | Viking Fuel`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blogg/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Viking Fuel' },
    publisher: {
      '@type': 'Organization',
      name: 'Viking Fuel',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/images/app_logo.png') },
    },
    mainEntityOfPage: `${SITE_URL}/blogg/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={articleSchema} />
      <AnnouncementBar />
      <Header />
      <main className="pt-24 pb-16">
        <article className="container-wide max-w-2xl">
          <Link href="/blogg" className="text-sm font-medium text-muted-foreground hover:text-foreground">← Blogg</Link>
          <p className="mt-4 text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString('sv-SE')} · {post.readingMinutes} min läsning
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>

          <div className="mt-8 space-y-5">
            {post.body.map((b, i) => {
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

          {/* Soft CTA */}
          <div className="mt-12 rounded-2xl border border-border bg-muted p-6 text-center">
            <p className="font-bold text-foreground">Redo att testa Viking Fuel?</p>
            <p className="mt-1 text-sm text-muted-foreground">Naturligt energitillskott — tillverkat i EU, fri frakt över 649 kr.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-95">
              Handla nu
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
