import React from 'react';
import type { Metadata } from 'next';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailView from '@/app/product-detail/components/ProductDetailView';
import KnowledgeStrip from '@/app/components/KnowledgeStrip';

export const metadata: Metadata = {
  title: 'Testo-support 3-pack (180 kapslar) — Viking Fuel',
  description: 'Testo-support 3-pack — 180 kapslar, 10% rabatt. Naturligt energitillskott och testo-support. Fri frakt över 649 kr.',
  alternates: { canonical: '/testo-support-3-pack' },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <ProductDetailView initialBundle={1} />
        <KnowledgeStrip />
      </main>
      <Footer />
    </div>
  );
}
