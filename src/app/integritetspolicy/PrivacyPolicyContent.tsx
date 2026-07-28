'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Sec = { heading: string; paragraphs: string[] };
type Content = { title: string; intro: string; sections: Sec[]; boxTitle: string; boxBody: string };

const content: Record<'sv' | 'en', Content> = {
  sv: {
    title: 'Integritetspolicy',
    intro: 'Vi värnar om din personliga integritet och är transparenta om hur vi hanterar dina data. Läs vår kompletta dataskyddspolicy nedan.',
    sections: [
      { heading: 'Om denna policy', paragraphs: [
        'SmartVal Sverige AB värnar om din personliga integritet och dataskydd. Den här integritetspolicyn förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter.',
        'Vi följer EU:s dataskyddsförordning (GDPR) och svenska dataskyddslagar. Har du frågor, kontakta oss på info@vikingfuel.se.',
      ]},
      { heading: 'Vilken information samlar vi in?', paragraphs: [
        'Vi samlar in information som du frivilligt ger oss när du gör en beställning, registrerar ett konto eller kontaktar oss:',
        '• Namn, e-postadress och telefonnummer\n• Leveransadress och fakturaadress\n• Betalningsinformation (via säkra betalningsleverantörer)\n• Orderhistorik och produktpreferenser\n• Kommunikation mellan dig och oss',
        'Vi samlar också in teknisk information automatiskt, som IP-adress, webbläsartyp och besöksdata via cookies och analytics.',
      ]},
      { heading: 'Hur använder vi din information?', paragraphs: [
        'Vi använder dina personuppgifter för följande syften:',
        '• Behandling och leverans av dina beställningar\n• Skicka orderbekräftelser och fraktinformation\n• Kundsupport och kommunikation\n• Förbättring av vår webbplats och tjänster\n• Marknadsföring och nyhetsbrev (endast med ditt samtycke)',
        'Du kan när som helst avsluta prenumerationen på våra nyhetsbrev via länken i e-postmeddelandet.',
      ]},
      { heading: 'Lagring och säkerhet', paragraphs: [
        'Vi lagrar dina personuppgifter på säkra servrar med kryptering och vidtar omfattande åtgärder för att skydda dina data.',
        'Vi använder SSL-kryptering för all datakommunikation och arbetar endast med betrodda betalningsleverantörer som Stripe.',
        'Personuppgifter sparas endast så länge det är nödvändigt, normalt mellan 2–5 år beroende på typ av data.',
      ]},
      { heading: 'Dina rättigheter', paragraphs: [
        'Du har rätt att:',
        '• Få tillgång till de personuppgifter vi lagrar om dig\n• Begära rättelse av felaktig information\n• Begära radering av dina uppgifter ("rätten att bli glömd")\n• Invända mot behandling av dina data\n• Begära en kopia av dina data i maskinläsbart format\n• Dra tillbaka ditt samtycke till marknadsföring',
        'För att utöva dessa rättigheter, kontakta oss på info@vikingfuel.se. Vi svarar inom 30 dagar.',
      ]},
      { heading: 'Cookies och spårning', paragraphs: [
        'Vi använder cookies för att förbättra din användarupplevelse och analysera webbplatstrafik.',
        'Du kan kontrollera cookies via dina webbläsarinställningar. Vissa cookies är nödvändiga, medan andra är valfria.',
        'Vi använder analysverktyg för att förstå hur besökare använder vår webbplats. Data är avidentifierad.',
      ]},
      { heading: 'Delning av uppgifter', paragraphs: [
        'Vi delar dina personuppgifter endast när det är nödvändigt för att leverera tjänster eller när vi är juridiskt förpliktade.',
        'Vi kan dela information med:',
        '• Fraktbolag för leverans av dina varor\n• Betalningsleverantörer för att behandla betalningar\n• Kundtjänstpartners för support\n• Myndigheter när det krävs enligt lag',
        'Vi säljer aldrig dina personuppgifter till tredje part för marknadsföring.',
      ]},
      { heading: 'Ändringar i denna policy', paragraphs: [
        'Vi kan uppdatera denna policy från tid till tid för att återspegla ändringar i våra metoder eller lagkrav.',
        'Betydande ändringar meddelas via e-post eller på vår webbplats.',
      ]},
      { heading: 'Kontakta oss', paragraphs: [
        'Har du frågor om denna policy eller hur vi hanterar dina personuppgifter, kontakta oss:',
        'E-post: info@vikingfuel.se\nAdress: SmartVal Sverige AB, Sverige\nResponstid: Vi svarar inom 1–2 arbetsdagar.',
      ]},
    ],
    boxTitle: '📋 Dataskyddsmyndigheten',
    boxBody: 'Om du anser att vi inte följer denna policy eller bryter mot dataskyddslagstiftningen, har du rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).',
  },
  en: {
    title: 'Privacy policy',
    intro: 'We care about your personal privacy and are transparent about how we handle your data. Read our full data protection policy below.',
    sections: [
      { heading: 'About this policy', paragraphs: [
        'SmartVal Sverige AB cares about your personal privacy and data protection. This privacy policy explains how we collect, use, store and protect your personal data.',
        'We comply with the EU General Data Protection Regulation (GDPR) and Swedish data protection laws. If you have questions, contact us at info@vikingfuel.se.',
      ]},
      { heading: 'What information do we collect?', paragraphs: [
        'We collect information you voluntarily provide when you place an order, register an account or contact us:',
        '• Name, email address and phone number\n• Delivery address and billing address\n• Payment information (via secure payment providers)\n• Order history and product preferences\n• Communication between you and us',
        'We also automatically collect technical information such as IP address, browser type and visit data via cookies and analytics.',
      ]},
      { heading: 'How do we use your information?', paragraphs: [
        'We use your personal data for the following purposes:',
        '• Processing and delivering your orders\n• Sending order confirmations and shipping information\n• Customer support and communication\n• Improving our website and services\n• Marketing and newsletters (only with your consent)',
        'You can unsubscribe from our newsletters at any time via the link in the email.',
      ]},
      { heading: 'Storage and security', paragraphs: [
        'We store your personal data on secure servers with encryption and take extensive measures to protect your data.',
        'We use SSL encryption for all data communication and only work with trusted payment providers such as Stripe.',
        'Personal data is kept only as long as necessary, normally between 2–5 years depending on the type of data.',
      ]},
      { heading: 'Your rights', paragraphs: [
        'You have the right to:',
        '• Access the personal data we store about you\n• Request correction of inaccurate information\n• Request deletion of your data ("the right to be forgotten")\n• Object to processing of your data\n• Request a copy of your data in a machine-readable format\n• Withdraw your consent to marketing',
        'To exercise these rights, contact us at info@vikingfuel.se. We respond within 30 days.',
      ]},
      { heading: 'Cookies and tracking', paragraphs: [
        'We use cookies to improve your experience and analyse website traffic.',
        'You can control cookies via your browser settings. Some cookies are necessary, while others are optional.',
        'We use analytics tools to understand how visitors use our website. Data is anonymised.',
      ]},
      { heading: 'Sharing of data', paragraphs: [
        'We share your personal data only when necessary to deliver services or when we are legally obliged to.',
        'We may share information with:',
        '• Shipping companies to deliver your goods\n• Payment providers to process payments\n• Customer service partners for support\n• Authorities when required by law',
        'We never sell your personal data to third parties for marketing.',
      ]},
      { heading: 'Changes to this policy', paragraphs: [
        'We may update this policy from time to time to reflect changes in our practices or legal requirements.',
        'Significant changes are announced by email or on our website.',
      ]},
      { heading: 'Contact us', paragraphs: [
        'If you have questions about this policy or how we handle your personal data, contact us:',
        'Email: info@vikingfuel.se\nAddress: SmartVal Sverige AB, Sweden\nResponse time: We reply within 1–2 business days.',
      ]},
    ],
    boxTitle: '📋 The data protection authority',
    boxBody: 'If you believe we do not follow this policy or breach data protection law, you have the right to lodge a complaint with the Swedish Authority for Privacy Protection (IMY).',
  },
};

export default function PrivacyPolicyContent() {
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

        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4">{c.boxTitle}</h3>
          <p className="text-muted-foreground">{c.boxBody}</p>
        </div>
      </div>
    </main>
  );
}
