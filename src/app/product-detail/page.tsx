import React from 'react';
import AnnouncementBar from '@/app/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailView from './components/ProductDetailView';

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <ProductDetailView />
      </main>
      <Footer />
    </div>
  );
}
