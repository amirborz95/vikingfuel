import React from 'react';
import type { Metadata } from 'next';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from './components/ProductCatalog';
import JsonLd from '@/components/JsonLd';
import { productListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Köp kosttillskott för energi — Viking Fuel Testo-support',
  description:
    'Handla Viking Fuel — naturligt energitillskott och testo-support med Maca, Ashwagandha och Ginseng. 1-, 3- och 6-pack. Fri frakt över 700 kr. Tillverkat i EU.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={productListSchema()} />
      <AnnouncementBar />
      <Header />
      <main>
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  );
}
