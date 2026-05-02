'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Terms of Service</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Here you will find our terms for purchases, delivery, returns, and liability.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Agreement and order</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The purchase agreement applies from the time we confirm your order by email. The confirmation contains order number, products, and price.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to deny or adjust an order if the product is no longer in stock or if the order information is incomplete.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Price and payment</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Prices are stated in SEK including Swedish VAT, unless otherwise stated. Payment is made at checkout through the methods offered at that time.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to make price changes or correct pricing errors, but you will always be informed before the purchase is completed.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Delivery and shipping time</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Delivery normally takes place within 1–3 business days after the order is sent. Shipping prices and delivery times are shown at checkout.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We deliver to the specified delivery address and are responsible for the goods until they are handed over to the carrier.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Right of withdrawal and returns</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have 14 days to change your mind from the date of delivery. Returns must be in perfect condition and in original packaging if possible.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Return costs may apply, and refund is made when we have received and checked the goods.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Liability and complaints</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We are responsible for errors or damage caused by us, but we cannot be held responsible for indirect losses that occur outside our control.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    In case of complaint, contact us and we will help you find a quick solution and handle any compensation or replacements.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Applicable law</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The agreement is governed by Swedish law. Any disputes should first be resolved through dialogue. If not possible, disputes may be decided in Swedish court.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
