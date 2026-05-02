import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <PrivacyPolicyContent />
      <Footer />
    </div>
  );
}
