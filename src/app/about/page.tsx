import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutContent from './AboutContent';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <AboutContent />
      <Footer />
    </div>
  );
}