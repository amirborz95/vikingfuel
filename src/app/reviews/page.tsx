import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '@/components/Footer';

export default function ReviewsPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main>
            <ReviewsSection />
          </main>
          <Footer />
        </div>  );
}