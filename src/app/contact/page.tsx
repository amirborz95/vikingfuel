'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">{t.nav.contact}</h1>
                <p className="text-lg text-muted-foreground">Do you have questions? Contact us and we'll help you.</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="bg-muted/30 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:info@vikingfuel.se" className="hover:text-primary transition-colors">
                          info@vikingfuel.se
                        </a>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Support</h3>
                      <p className="text-muted-foreground">
                        Our customer service responds quickly to questions about orders, products, and shipping.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Shipping & delivery</h3>
                      <p className="text-muted-foreground">
                        Learn more about delivery times and shipping costs at{' '}
                        <Link href="/frakt-leverans" className="hover:text-primary transition-colors">
                          Shipping & delivery
                        </Link>.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Return policy</h3>
                      <p className="text-muted-foreground">
                        See our complete return policy for information about returns, refunds, and more at{' '}
                        <Link href="/returpolicy" className="hover:text-primary transition-colors">
                          Return policy
                        </Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}