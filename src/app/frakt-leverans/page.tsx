import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShippingContent from './ShippingContent';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <ShippingContent />
      <Footer />
    </div>
  );
}
