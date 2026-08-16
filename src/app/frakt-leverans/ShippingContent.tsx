'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Section = { h: string; body: string };
type Content = {
  title: string;
  intro: string;
  sections: Section[];
  boxTitle: string;
  boxBody: string;
};

const content: Record<'sv' | 'en', Content> = {
  sv: {
    title: 'Frakt & Leverans',
    intro:
      'Vi erbjuder snabb och pålitlig leverans av dina Viking Fuel-produkter direkt till din dörr. Läs om våra fraktalternativ och leveransprocessen.',
    sections: [
      {
        h: '📦 Snabb leverans inom Sverige',
        body: 'Vi skickar din beställning inom 1–2 arbetsdagar efter orderbekräftelse (helgfritt). Vi arbetar med pålitliga logistikpartner för att säkerställa att dina varor ankommer i perfekt skick.<br/><br/><strong>Leveranstider:</strong> 2 till 4 dagar<br/><br/>Leveranstiden räknas från det att paketet lämnas till transportören, inte från orderbekräftelse.',
      },
      {
        h: '💰 Fraktkostnader',
        body: 'Fraktkostnaden beräknas automatiskt baserat på din leveransadress och visas i kassan.<br/><br/><strong>Fraktkostnadsöversikt:</strong><br/>• Frakt från 39 kr inom hela Sverige, beräknad efter vikt.<br/>• Fri frakt: På beställningar över 649 kr<br/>• Uthämtning på plats: alltid gratis',
      },
      {
        h: '📍 Spårning av paket',
        body: 'När din beställning är skickad får du en spårningslänk via e-post. Du kan följa ditt paket i realtid från vårt lager till din hemadress.<br/><br/>Om du inte mottar spårningslänken, kontakta oss på info@vikingfuel.se.',
      },
      {
        h: '🛠️ Hantering av beställningar',
        body: '<strong>Ändra eller avboka din beställning:</strong><br/>Du kan ändra eller avboka din beställning <strong>innan den har skickats från vårt lager</strong> (normalt inom 24 timmar).<br/><br/>E-posta oss på info@vikingfuel.se med ditt ordernummer. Om paketet redan är skickat kan du returnera det enligt vår returpolicy (14 dagars ångerrätt).',
      },
      {
        h: '🚚 Skadat eller försvunnet paket',
        body: '<strong>Skadat paket:</strong><br/>1. Kontakta oss omedelbart med foton på skadan och paketet<br/>2. Vi ersätter varan eller ger återbetalning<br/><br/><strong>Försvunnet paket:</strong><br/>1. Spåra paketet via länken i e-posten<br/>2. Kontakta oss om paketet inte ankommer<br/>3. Vi lämnar reklamation till transportören och ersätter dig',
      },
      {
        h: '🌍 Internationell frakt',
        body: 'Vi skickar även utomlands med PostNord. Fraktkostnaden beräknas i kassan baserat på ditt land. Kontakta oss på info@vikingfuel.se om du har frågor om internationell leverans eller grossistköp.',
      },
      {
        h: '💬 Frågor om din leverans?',
        body: 'Vi är här för att hjälpa! Kontakta vårt kundtjänstteam:<br/><br/>E-post: info@vikingfuel.se<br/>Svarstid: 1–2 arbetsdagar<br/>Öppettider: Mån–Fre 09:00–17:00 CET',
      },
    ],
    boxTitle: '✅ Vår leveransgaranti',
    boxBody:
      'Vi garanterar säker och snabb leverans av dina produkter. Om något går fel, löser vi det omedelbart utan krångel. Din tillfredsställelse är vår prioritet!',
  },
  en: {
    title: 'Shipping & Delivery',
    intro:
      'We offer fast and reliable delivery of your Viking Fuel products straight to your door. Read about our shipping options and the delivery process.',
    sections: [
      {
        h: '📦 Fast delivery',
        body: 'We ship your order within 1–2 business days after order confirmation (excluding weekends). We work with reliable logistics partners to ensure your products arrive in perfect condition.<br/><br/><strong>Delivery times:</strong> 2 to 4 days within Sweden (longer for international).<br/><br/>Delivery time is counted from when the parcel is handed to the carrier, not from order confirmation.',
      },
      {
        h: '💰 Shipping costs',
        body: 'The shipping cost is calculated automatically based on your delivery address and shown at checkout.<br/><br/><strong>Shipping overview:</strong><br/>• Shipping within Sweden from 39 kr, by weight.<br/>• Free shipping: on orders over 649 kr<br/>• Local pickup: always free<br/>• International: calculated by destination country at checkout',
      },
      {
        h: '📍 Package tracking',
        body: "Once your order has shipped you'll receive a tracking link by email. You can follow your parcel in real time from our warehouse to your address.<br/><br/>If you don't receive the tracking link, contact us at info@vikingfuel.se.",
      },
      {
        h: '🛠️ Managing orders',
        body: '<strong>Change or cancel your order:</strong><br/>You can change or cancel your order <strong>before it has shipped from our warehouse</strong> (usually within 24 hours).<br/><br/>Email us at info@vikingfuel.se with your order number. If the parcel has already shipped, you can return it under our return policy (14-day right of withdrawal).',
      },
      {
        h: '🚚 Damaged or lost parcel',
        body: '<strong>Damaged parcel:</strong><br/>1. Contact us immediately with photos of the damage and the parcel<br/>2. We replace the item or issue a refund<br/><br/><strong>Lost parcel:</strong><br/>1. Track the parcel via the link in the email<br/>2. Contact us if the parcel does not arrive<br/>3. We file a claim with the carrier and compensate you',
      },
      {
        h: '🌍 International shipping',
        body: 'We also ship abroad with PostNord. The shipping cost is calculated at checkout based on your country. Contact us at info@vikingfuel.se if you have questions about international delivery or wholesale orders.',
      },
      {
        h: '💬 Questions about your delivery?',
        body: "We're here to help! Contact our customer service team:<br/><br/>Email: info@vikingfuel.se<br/>Response time: 1–2 business days<br/>Opening hours: Mon–Fri 09:00–17:00 CET",
      },
    ],
    boxTitle: '✅ Our delivery guarantee',
    boxBody:
      'We guarantee safe and fast delivery of your products. If anything goes wrong, we resolve it immediately without hassle. Your satisfaction is our priority!',
  },
};

export default function ShippingContent() {
  const { lang } = useLanguage();
  const c = content[lang] || content.sv;

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">{c.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.intro}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {c.sections.map((s) => (
            <section key={s.h} className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">{s.h}</h2>
              <p
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </section>
          ))}
        </div>

        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4">{c.boxTitle}</h3>
          <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: c.boxBody }} />
        </div>
      </div>
    </main>
  );
}
