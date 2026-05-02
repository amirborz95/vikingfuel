import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  const { t } = useLanguage();

  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">{t.shipping.title}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t.shipping.description}
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.shipping.fastDeliveryTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t.shipping.fastDeliveryLead}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.shipping.fastDeliveryDetail}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.shipping.freeShippingTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t.shipping.freeShippingLead}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.shipping.shippingCostDetail}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.shipping.trackingTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t.shipping.trackingLead}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.shipping.trackingDetail}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.shipping.orderHandlingTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t.shipping.orderHandlingLead}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.shipping.orderHandlingDetail}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.shipping.internationalTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t.shipping.internationalLead}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.shipping.internationalDetail}
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
