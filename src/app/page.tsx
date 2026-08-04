'use client';

import React from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import HomeFeatures3 from './components/HomeFeatures3';
import TestoSupportSection from './components/TestoSupportSection';
import ForgedInNorth from './components/ForgedInNorth';
import HomeFeatures4 from './components/HomeFeatures4';
import InstagramCommunity from './components/InstagramCommunity';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#17150f]">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <HomeFeatures3 />
        <TestoSupportSection />
        <ForgedInNorth />
        <HomeFeatures4 />
        <InstagramCommunity />
      </main>
      <Footer />
    </div>
  );
}
