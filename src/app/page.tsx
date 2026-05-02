'use client';

import React, { useEffect, useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import CategoryBanners from './components/CategoryBanners';
import ProductsSection from './components/ProductsSection';
import TrustBenefits from './components/TrustBenefits';
import CTASection from './components/CTASection';
import Footer from '@/components/Footer';
import NewsletterModal from '../components/NewsletterModal';

export default function HomePage() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = window.localStorage.getItem('vikingfuel_newsletter');
    if (!storedEmail) {
      const timer = window.setTimeout(() => setNewsletterOpen(true), 4500);
      return () => window.clearTimeout(timer);
    }
    setNewsletterEmail(storedEmail);
  }, []);

  const handleNewsletterSubmit = (email: string) => {
    window.localStorage.setItem('vikingfuel_newsletter', email);
    setNewsletterEmail(email);
    setNewsletterOpen(false);
  };

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
      <NewsletterModal
        open={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        onSubmit={handleNewsletterSubmit}
        savedEmail={newsletterEmail ?? undefined}
      />
    </div>
  );
}
