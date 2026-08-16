import React from 'react';
import type { Metadata } from 'next';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailView from '@/app/product-detail/components/ProductDetailView';

export const metadata: Metadata = {
  title: 'Testo-support (60 kapslar) — Viking Fuel',
  description: 'Testo-support enstaka flaska — 60 kapslar. Naturligt energitillskott och testo-support. Fri frakt över 649 kr.',
  alternates: { canonical: '/testo-support' },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <ProductDetailView initialBundle={0} />
      </main>
      <Footer />
    </div>
  );
}
