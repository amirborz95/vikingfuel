'use client';

import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TermsContent from './TermsContent';

export default function TermsPage() {

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <TermsContent />
      <Footer />
    </div>
  );
}
