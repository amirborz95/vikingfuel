'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Privacy Policy</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We care about your privacy and describe how we collect and process personal data.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Personal data we collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information such as name, email address, address, and phone number when you place an order or contact us.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    This information is used to process your order, provide customer service, and send important information about your delivery.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Purpose of processing</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use your data to fulfill purchase agreements, administer delivery, respond to inquiries, and send order confirmations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Data may also be used to improve our service and communication, always with respect for your privacy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Legal basis</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Processing is based on the necessity to fulfill an agreement with you and our legitimate interest in operating the business.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We only process personal data to the extent necessary to deliver products and manage customer relationships.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Storage and security</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We store your data as long as necessary to fulfill agreements and legal requirements. Data no longer needed is deleted or anonymized.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We have technical and organizational measures in place to protect your data from unauthorized access and loss.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Your rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have the right to request information about what data we process about you, request correction or deletion, and object to processing.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Contact us at info@vikingfuel.se to exercise your rights or if you have questions about how we handle your data.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Third-party providers</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We work with trusted providers who handle payments, shipping information, and website operations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    These providers only have access to data necessary for their tasks and may not use it for other purposes.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
