'use client';

import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">{t.faq.title}</h1>
                <p className="text-lg text-muted-foreground">{t.faq.subtitle}</p>
              </div>
              <div className="max-w-3xl mx-auto space-y-6">
                {t.faq.items.map((faq, index) => (
                  <div key={index} className="bg-muted/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}