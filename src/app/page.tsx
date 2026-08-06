'use client';

import React from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import HomeFeatures4 from './components/HomeFeatures4';
import TakeControlCTA from './components/TakeControlCTA';
import InstagramCommunity from './components/InstagramCommunity';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <HomeFeatures4 />
        <TakeControlCTA />
        <InstagramCommunity />
      </main>
      <Footer />
    </div>
  );
}
