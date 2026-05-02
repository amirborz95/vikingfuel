'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Return Policy</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We want to make returns and refunds as easy as possible. Read our complete return policy here.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">30-day returns</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We offer 30 days to change your mind from the date you receive your order. If for any reason you want to return a product, please contact our customer service to initiate the return process.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Return fees may vary depending on the shipping method you choose. Refunds are made when we have received and checked the item.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">How to return</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To return an order, contact us at info@vikingfuel.se. Provide your order number and which item you want to return.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We will send you instructions for the return label and address. Make sure the product is returned in undamaged condition and in original packaging if possible.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Return conditions</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    For a return to be accepted, the product must be unused and in the same condition as when received. Products showing clear signs of use may be denied return or refund.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    However, we of course replace products that are faulty, damaged, or delivered incorrectly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Refund time</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    When we receive and review your return, we refund the amount to the same payment method used at purchase. This normally takes 7–14 days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Any return shipping costs are covered by you unless it is due to faulty or damaged delivery.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Damaged or incorrect items</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you receive an item that is damaged, incorrect, or does not match the description, contact us immediately and we will resolve it without delay.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We will replace or exchange the product and help you with return shipping if needed.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
