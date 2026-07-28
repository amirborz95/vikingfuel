'use client';

import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

type Section = { h: string; body: string };
type Content = {
  title: string;
  intro: string;
  sections: Section[];
  guaranteeTitle: string;
  guaranteeBody: string;
};

const content: Record<'sv' | 'en', Content> = {
  sv: {
    title: 'Returpolicy',
    intro:
      'Du har 14 dagar på dig att returnera produkter enligt distansköpslagar. Läs vår kompletta returpolicy här.',
    sections: [
      {
        h: '⏰ 14 dagars ångerrätt',
        body: 'Du har rätt att returnera oanvända produkter inom 14 dagar efter leverans. Detta är din lagstadgade ångerrätt enligt EU:s distansköpsdirektiv.<br/><br/><strong>Viktiga villkor för retur:</strong><br/>• Produkten måste vara oanvänd och i originalskick<br/>• Original förpackning och etikett måste finnas kvar<br/>• Alla tillbehör och instruktioner måste medföljas<br/>• Returrätten gäller inte för öppnade eller konsumerade produkter (hälsoskäl)<br/>• Returfrakten bekostas av dig (undantag vid fel eller felaktig leverans)<br/><br/>Om du returnerar en produkt på grund av att du är missnöjd, tar du returkostnaden. Om vi skickade fel produkt eller den är skadad, betalar vi returfrakten.',
      },
      {
        h: '📝 Returprocess steg-för-steg',
        body: '<strong>Steg 1: Kontakta oss</strong><br/>Skicka ett e-postmeddelande till info@vikingfuel.se med:<br/>• Ditt ordernummer<br/>• Anledning till retur<br/>• Ditt namn och kontaktinfo<br/><br/><strong>Steg 2: Få returinstruktioner</strong><br/>Vi svarar normalt inom 24 timmar med returinstruktioner och returadress.<br/><br/><strong>Steg 3: Förbereda returpaketet</strong><br/>• Packa produkten i originalförpackning<br/>• Inkludera alla originaldelar och dokumentation<br/>• Använd returadressen och spårningsnummer vi tillhandahåller<br/><br/><strong>Steg 4: Skicka paketet</strong><br/>Skicka paketet till den adress vi angav. Du kan lämna det hos PostNord enligt anvisningarna.<br/><br/><strong>Steg 5: Återbetalning</strong><br/>När vi mottar och inspekterar returpaketet bearbetar vi återbetalningen inom 5–10 arbetsdagar.',
      },
      {
        h: '💳 Återbetalning',
        body: 'Återbetalningen sker till samma betalningsmetod som du använde vid köpet:<br/><br/><strong>Kreditkort (Visa, Mastercard):</strong><br/>Normalt inom 3–5 arbetsdagar efter att vi behandlat returpaketet. Din bank kan ta ytterligare 2–3 dagar.<br/><br/><strong>Klarna:</strong><br/>Hanteras av Klarna normalt inom 5–10 arbetsdagar.<br/><br/><strong>Viktigt:</strong> Vi återbetalar inte returfraktkostnaden om du returnerar på grund av ånger. Vi återbetalar returfrakten endast om det var vårt fel (fel produkt, skada, etc.).',
      },
      {
        h: '🚫 Vad kan inte returneras?',
        body: 'Vi kan inte acceptera returer av:<br/>• <strong>Delvis använda produkter</strong><br/>• <strong>Produkter med saknad/skadad förpackning</strong><br/>• <strong>Produkter utan etikett</strong> – etiketten måste finnas kvar<br/>• <strong>Använt tillbehör</strong> som visar tecken på användning<br/>• <strong>Gåvor utan originalkvitto</strong> – du måste ha ordernummer eller originalbevis av köpet',
      },
      {
        h: '⚠️ Fel eller skadade produkter',
        body: 'Om du mottar en felaktig eller skadad produkt kan du returnera den kostnadsfritt:<br/><br/><strong>Procedur:</strong><br/>1. Kontakta oss omedelbart med foton på produkten och eventuella skador<br/>2. Vi skickar en kostnadsfri returetikett<br/>3. Skicka produkten och vi inspekterar den<br/>4. Vi ersätter den med korrekt produkt eller ger full återbetalning (inklusive returfrakten)',
      },
      {
        h: '📅 Tidsgränser för retur',
        body: '<strong>14 dagar från leverans:</strong> Du måste initiera en retur inom 14 dagar från dagen du mottar produkten.<br/><br/><strong>30 dagar för återbetalning:</strong> Vi bearbetar återbetalningen normalt inom 10 arbetsdagar, men lagkrav tillåter upp till 30 dagar.<br/><br/><strong>Spårning:</strong> Vi rekommenderar att du skickar paketet med spårningsnummer.',
      },
      {
        h: '💬 Frågor eller problem med retur?',
        body: 'Vi vill säkerställa att du är nöjd. Kontakta oss för hjälp:<br/><br/>E-post: info@vikingfuel.se<br/>Svarstid: 1–2 arbetsdagar<br/>Öppettider: Mån–Fre 09:00–17:00 CET',
      },
      {
        h: '📞 Tvister eller komplikationer',
        body: 'Om det uppstår oenighet om en retur eller om vi inte kan lösa problemet, kan du:<br/>• <strong>Kontakta Konsumentverket:</strong> som kan medla mellan dig och oss<br/>• <strong>Allmänna Reklamationsnämnden (ARN):</strong> en oberoende nämnd som löser tvister mellan konsumenter och företag<br/><br/>Vi strävar alltid efter att lösa alla ärenden. Ditt nöje är vår prioritet!',
      },
    ],
    guaranteeTitle: '✅ Garantirätt och konsumenträttigheter',
    guaranteeBody:
      'Förutom ångerrätten har du även andra konsumenträttigheter:<br/>• <strong>3 års reklamationsrätt:</strong> Om produkten är felaktig får du rättelse eller ersättning<br/>• <strong>Kostnadsfri åtgärd:</strong> Vi fixar eller byter felaktig vara utan kostnad',
  },
  en: {
    title: 'Return policy',
    intro:
      'You have 14 days to return products under distance selling laws. Read our full return policy here.',
    sections: [
      {
        h: '⏰ 14-day right of withdrawal',
        body: "You have the right to return unused products within 14 days of delivery. This is your statutory right of withdrawal under the EU Distance Selling Directive.<br/><br/><strong>Important conditions for returns:</strong><br/>• The product must be unused and in original condition<br/>• Original packaging and label must remain<br/>• All accessories and instructions must be included<br/>• The right of return does not apply to opened or consumed products (health reasons)<br/>• Return shipping is paid by you (except in case of error or faulty delivery)<br/><br/>If you return a product because you're dissatisfied, you cover the return cost. If we sent the wrong product or it's damaged, we pay the return shipping.",
      },
      {
        h: '📝 Return process step by step',
        body: '<strong>Step 1: Contact us</strong><br/>Send an email to info@vikingfuel.se with:<br/>• Your order number<br/>• Reason for the return<br/>• Your name and contact info<br/><br/><strong>Step 2: Get return instructions</strong><br/>We normally reply within 24 hours with return instructions and a return address.<br/><br/><strong>Step 3: Prepare the return package</strong><br/>• Pack the product in its original packaging<br/>• Include all original parts and documentation<br/>• Use the return address and tracking number we provide<br/><br/><strong>Step 4: Send the package</strong><br/>Send the package to the address we provided. You can drop it off at PostNord as instructed.<br/><br/><strong>Step 5: Refund</strong><br/>Once we receive and inspect the return, we process the refund within 5–10 business days.',
      },
      {
        h: '💳 Refund',
        body: 'The refund is made to the same payment method you used for the purchase:<br/><br/><strong>Credit card (Visa, Mastercard):</strong><br/>Normally within 3–5 business days after we process the return. Your bank may take a further 2–3 days.<br/><br/><strong>Klarna:</strong><br/>Handled by Klarna, normally within 5–10 business days.<br/><br/><strong>Important:</strong> We do not refund the return shipping cost if you return due to change of mind. We refund return shipping only if it was our fault (wrong product, damage, etc.).',
      },
      {
        h: '🚫 What cannot be returned?',
        body: 'We cannot accept returns of:<br/>• <strong>Partially used products</strong><br/>• <strong>Products with missing/damaged packaging</strong><br/>• <strong>Products without a label</strong> – the label must remain<br/>• <strong>Used accessories</strong> that show signs of use<br/>• <strong>Gifts without an original receipt</strong> – you must have an order number or proof of purchase',
      },
      {
        h: '⚠️ Faulty or damaged products',
        body: 'If you receive a faulty or damaged product you can return it free of charge:<br/><br/><strong>Procedure:</strong><br/>1. Contact us immediately with photos of the product and any damage<br/>2. We send a free return label<br/>3. Send the product and we inspect it<br/>4. We replace it with the correct product or give a full refund (including return shipping)',
      },
      {
        h: '📅 Time limits for returns',
        body: '<strong>14 days from delivery:</strong> You must initiate a return within 14 days from the day you receive the product.<br/><br/><strong>30 days for refund:</strong> We normally process refunds within 10 business days, but the law allows up to 30 days.<br/><br/><strong>Tracking:</strong> We recommend sending the package with a tracking number.',
      },
      {
        h: '💬 Questions or problems with a return?',
        body: 'We want to make sure you are satisfied. Contact us for help:<br/><br/>Email: info@vikingfuel.se<br/>Response time: 1–2 business days<br/>Opening hours: Mon–Fri 09:00–17:00 CET',
      },
      {
        h: '📞 Disputes or complications',
        body: 'If a disagreement arises about a return, or if we cannot resolve the issue, you can:<br/>• <strong>Contact the Swedish Consumer Agency</strong> which can mediate between you and us<br/>• <strong>The National Board for Consumer Disputes (ARN):</strong> an independent board that resolves disputes between consumers and companies<br/><br/>We always strive to resolve every case. Your satisfaction is our priority!',
      },
    ],
    guaranteeTitle: '✅ Warranty and consumer rights',
    guaranteeBody:
      'In addition to the right of withdrawal, you also have other consumer rights:<br/>• <strong>3-year right to complain:</strong> If the product is faulty you get a remedy or compensation<br/>• <strong>Free remedy:</strong> We repair or replace a faulty product at no cost',
  },
};

export default function ReturnPolicyPage() {
  const { lang } = useLanguage();
  const c = content[lang] || content.sv;

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
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

          <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">{c.guaranteeTitle}</h3>
            <p
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: c.guaranteeBody }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
