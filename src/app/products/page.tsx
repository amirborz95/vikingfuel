import React from 'react';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from './components/ProductCatalog';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  );
}
