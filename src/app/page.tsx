import React from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import CategoryBanners from './components/CategoryBanners';
import ProductsSection from './components/ProductsSection';
import TrustBenefits from './components/TrustBenefits';
import CTASection from './components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <TrustBenefits />
        <CategoryBanners />
        <ProductsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
