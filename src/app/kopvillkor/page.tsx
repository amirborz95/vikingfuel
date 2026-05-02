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
      <main className="py-20">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">Köpvillkor</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Läs våra villkor för köp och leverans.
            </p>
          </div>
          <TermsContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
