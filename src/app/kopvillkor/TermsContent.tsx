'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Sec = { heading: string; paragraphs: string[] };
type Content = { title: string; intro: string; sections: Sec[]; boxTitle: string; boxIntro: string; boxList: string[] };

const content: Record<'sv' | 'en', Content> = {
  sv: {
    title: 'Köpvillkor',
    intro: 'Läs våra kompletta köpvillkor för beställningar, betalning, leverans och returer.',
    sections: [
      { heading: 'Allmänna villkor', paragraphs: [
        'Genom att besöka och handla på vikingfuel.se godkänner du dessa villkor. Vi förbehåller oss rätten att ändra villkoren när som helst.',
        'Vi rekommenderar att du läser denna sida regelbundet. Betydande ändringar meddelas via e-post eller på webbplatsen.',
        'Vi är ett svenskregistrerat företag (SmartVal Sverige AB) och följer svenska och EU:s konsumentskyddslagar.',
      ]},
      { heading: 'Beställningar och orderbekräftelse', paragraphs: [
        'En beställning görs genom att fylla i formuläret på vår webbplats och bekräfta köpet. Din order är bindande när du klickat "Bekräfta köpet".',
        'Du kommer att motta en orderbekräftelse via e-post med dina orderdetaljer, totalpris och leveransadress.',
        'Vi gör vårt bästa för att hålla lagersaldot uppdaterat. Om en vara är slut trots att den visas tillgänglig kontaktar vi dig omedelbart för att diskutera alternativ eller full återbetalning.',
      ]},
      { heading: 'Priser och betalning', paragraphs: [
        'Alla priser anges i svenska kronor (SEK) och inkluderar svensk moms (6%). Moms ingår i totalsumman.',
        'Vi accepterar betalning via säkra metoder: Visa, Mastercard och Klarna. Alla betalningar hanteras av säkra betalningsleverantörer.',
        'Betalningen är säker genom SSL-kryptering och vi sparar aldrig dina kortuppgifter.',
        'Du ser den exakta fraktkostnaden i kassan innan du bekräftar din beställning.',
      ]},
      { heading: 'Leverans och risker', paragraphs: [
        'Vi skickar dina varor inom 1–2 arbetsdagar efter orderbekräftelse (helgfritt). Leveranstiden i Sverige är normalt 2–4 dagar.',
        'Risken för varorna övergår till dig när de levererats till den adress du angett.',
        'Om paketet anländer skadat, kontakta oss omedelbart med bilder på skadan. Vi löser sådana ärenden snabbt.',
        'Vi erbjuder spårningslänk så att du kan följa ditt paket. Spårningsinformation skickas via e-post när din beställning skickas.',
      ]},
      { heading: 'Ångerrätt och returer', paragraphs: [
        'Som konsument har du rätt att returnera oanvända varor inom 14 dagar efter mottagandet.',
        'För att initiera en retur, kontakta oss på info@vikingfuel.se med ditt ordernummer.',
        'Produkten måste returneras i originalförpackning, i samma skick som vid mottagandet. Vi kan inte acceptera öppnade eller använda produkter (hälsoskäl).',
        'Returfrakten bekostas av dig. Vid fel på produkten eller felaktig leverans betalar vi returfrakten.',
        'Se även vår separata returpolicy för mer information.',
      ]},
      { heading: 'Produktansvar och begränsningar', paragraphs: [
        'Viking Fuel erbjuder högkvalitativa kosttillskott tillverkade i Europa.',
        'Konsultera en läkare eller dietist före användning, särskilt om du tar medicin eller har hälsoproblem.',
        'Vi är inte ansvariga för indirekta eller följdskador som uppstår från användning av våra produkter.',
        'Vi strävar efter att all information på vår webbplats är korrekt, men kan inte garantera fullständig exakthet.',
      ]},
      { heading: 'Immaterialrätter', paragraphs: [
        'Allt innehåll på vår webbplats – texter, bilder, logotyper och design – är skyddat av upphovsrätt och tillhör SmartVal Sverige AB.',
        'Du får inte kopiera, distribuera eller använda innehållet för kommersiella ändamål utan skriftligt tillstånd.',
      ]},
      { heading: 'Tvister och tillämplig lag', paragraphs: [
        'Dessa villkor och alla köp styrs av svensk lag.',
        'Eventuella tvister löses initialt genom förhandling. Om tvisten inte kan lösas kan den hänvisas till Allmän domstol i Sverige.',
        'För konsumentklagomål kan du även kontakta Allmänna Reklamationsnämnden (ARN) eller Konsumentverket.',
      ]},
      { heading: 'Kontakt och kundtjänst', paragraphs: [
        'Vi strävar efter bästa möjliga kundservice. Vid frågor eller problem, kontakta oss:',
        'E-post: info@vikingfuel.se\nSvarstid: Vi svarar normalt inom 1–2 arbetsdagar.',
      ]},
    ],
    boxTitle: '⚖️ Konsumenträttigheter',
    boxIntro: 'Som konsument skyddas du av svensk konsumentskyddslag. Du har rätt till:',
    boxList: [
      '• Rätt att ångra köpet inom 14 dagar',
      '• Reklamationsrätt på felaktig vara',
      '• Rätt att få felaktig vara reparerad eller ersatt',
      '• Rätt att begära prisnedsättning eller återbetalning vid väsentligt fel',
    ],
  },
  en: {
    title: 'Terms of purchase',
    intro: 'Read our full terms of purchase for orders, payment, delivery and returns.',
    sections: [
      { heading: 'General terms', paragraphs: [
        'By visiting and shopping at vikingfuel.se you accept these terms. We reserve the right to change the terms at any time.',
        'We recommend that you read this page regularly. Significant changes are announced by email or on the website.',
        'We are a Swedish-registered company (SmartVal Sverige AB) and comply with Swedish and EU consumer protection laws.',
      ]},
      { heading: 'Orders and order confirmation', paragraphs: [
        'An order is placed by filling in the form on our website and confirming the purchase. Your order is binding once you click "Confirm purchase".',
        'You will receive an order confirmation by email with your order details, total price and delivery address.',
        'We do our best to keep stock levels updated. If an item is out of stock despite showing as available, we contact you immediately to discuss alternatives or a full refund.',
      ]},
      { heading: 'Prices and payment', paragraphs: [
        'All prices are stated in Swedish kronor (SEK) and include Swedish VAT (6%). VAT is included in the total.',
        'We accept payment via secure methods: Visa, Mastercard and Klarna. All payments are handled by secure payment providers.',
        'Payment is secure via SSL encryption and we never store your card details.',
        'You can see the exact shipping cost at checkout before confirming your order.',
      ]},
      { heading: 'Delivery and risk', paragraphs: [
        'We ship your products within 1–2 business days after order confirmation (excluding weekends). Delivery time in Sweden is normally 2–4 days.',
        'The risk for the goods passes to you when they are delivered to the address you provided.',
        'If the parcel arrives damaged, contact us immediately with photos of the damage. We resolve such cases quickly.',
        "We offer a tracking link so you can follow your parcel. Tracking information is sent by email when your order ships.",
      ]},
      { heading: 'Right of withdrawal and returns', paragraphs: [
        'As a consumer you have the right to return unused goods within 14 days of receipt.',
        'To initiate a return, contact us at info@vikingfuel.se with your order number.',
        'The product must be returned in original packaging, in the same condition as received. We cannot accept opened or used products (health reasons).',
        'Return shipping is paid by you. In case of a faulty product or incorrect delivery, we pay the return shipping.',
        'See also our separate return policy for more information.',
      ]},
      { heading: 'Product liability and limitations', paragraphs: [
        'Viking Fuel offers high-quality supplements made in Europe.',
        'Consult a doctor or dietitian before use, especially if you take medication or have health issues.',
        'We are not liable for indirect or consequential damages arising from the use of our products.',
        'We strive to keep all information on our website accurate, but cannot guarantee complete accuracy.',
      ]},
      { heading: 'Intellectual property', paragraphs: [
        'All content on our website – text, images, logos and design – is protected by copyright and belongs to SmartVal Sverige AB.',
        'You may not copy, distribute or use the content for commercial purposes without written permission.',
      ]},
      { heading: 'Disputes and applicable law', paragraphs: [
        'These terms and all purchases are governed by Swedish law.',
        'Any disputes are first resolved through negotiation. If a dispute cannot be resolved, it may be referred to a general court in Sweden.',
        'For consumer complaints you can also contact the National Board for Consumer Disputes (ARN) or the Swedish Consumer Agency.',
      ]},
      { heading: 'Contact and customer service', paragraphs: [
        'We strive for the best possible customer service. For questions or problems, contact us:',
        'Email: info@vikingfuel.se\nResponse time: We normally reply within 1–2 business days.',
      ]},
    ],
    boxTitle: '⚖️ Consumer rights',
    boxIntro: 'As a consumer you are protected by Swedish consumer protection law. You have the right to:',
    boxList: [
      '• The right to withdraw from the purchase within 14 days',
      '• The right to complain about a faulty product',
      '• The right to have a faulty product repaired or replaced',
      '• The right to request a price reduction or refund for a material fault',
    ],
  },
};

export default function TermsContent() {
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
          {c.sections.map((section) => (
            <section key={section.heading} className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
              {section.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4">{c.boxTitle}</h3>
          <p className="text-muted-foreground mb-2">{c.boxIntro}</p>
          <ul className="text-muted-foreground space-y-1 ml-4">
            {c.boxList.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
