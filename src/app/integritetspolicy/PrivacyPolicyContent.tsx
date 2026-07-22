'use client';

import React from 'react';

const sections = [
  {
    heading: 'Om denna policy',
    paragraphs: [
      'SmartVal AB värnar om din personliga integritet och dataskydd. Den här integritetspolicyn förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter.',
      'Vi följer EU:s dataskyddsförordning (GDPR) och svenska dataskyddslagar. Om du har frågor om hur vi hanterar dina data, kontakta oss på info@vikingfuel.se.',
    ],
  },
  {
    heading: 'Vilken information samlar vi in?',
    paragraphs: [
      'Vi samlar in information som du frivilligt ger oss när du gör en beställning, registrerar ett konto eller kontaktar oss. Detta inkluderar:',
      '• Namn, e-postadress och telefonnummer\n• Leveradsress och fakturaadress\n• Betalningsinformation (via säkra betalningsleverantörer)\n• Orderhistorik och produktpreferenser\n• Kommunikation mellan dig och oss',
      'Vi samlar också in teknisk information automatiskt, som IP-adress, webbläsartyp och besöksdata via cookies och analytics.',
    ],
  },
  {
    heading: 'Hur använder vi din information?',
    paragraphs: [
      'Vi använder dina personuppgifter för följande syften:',
      '• Behandling och leverans av dina beställningar\n• Skicka orderbekräftelser och fraktinformation\n• Kundsupport och kommunikation\n• Förbättring av vår webbplats och tjänster\n• Marknadsföring och nyhetsbrev (endast med ditt samtycke)',
      'Du kan när som helst avsluta prenumerationen på våra nyhetsbrev genom att klicka på länken i e-postmeddelandet.',
    ],
  },
  {
    heading: 'Lagring och säkerhet',
    paragraphs: [
      'Vi lagrar dina personuppgifter på säkra servrar med kryptering. Vi vidtar omfattande åtgärder för att skydda dina data mot obehörig åtkomst, ändringar, avslöjande eller förstöring.',
      'Vi använder SSL-kryptering för all datakommunikation och arbetar endast med betrodda betalningsleverantörer som Stripe för säker betalningshantering.',
      'Personuppgifter sparas endast så länge det är nödvändigt för att uppfylla syftet de samlades in för, normalt mellan 2–5 år beroende på typ av data.',
    ],
  },
  {
    heading: 'Dina rättigheter',
    paragraphs: [
      'Du har rätt att:',
      '• Få tillgång till de personuppgifter vi lagrar om dig\n• Begära rättelse av felaktig information\n• Begära radering av dina uppgifter ("rätten att bli glömd")\n• Invända mot bearbetning av dina data\n• Begära en kopia av dina data i maskinläsbart format\n• Dra tillbaka ditt samtycke till marknadsföringsmeddelanden',
      'För att utöva dessa rättigheter, kontakta oss på info@vikingfuel.se. Vi svarar på begäranden inom 30 dagar.',
    ],
  },
  {
    heading: 'Cookies och spårning',
    paragraphs: [
      'Vi använder cookies för att förbättra din användarupplevelse och analysera webbplatstrafik. Cookies är små textfiler som sparas på din enhet.',
      'Du kan kontrollera cookies genom dina webbläsarinställningar. Vissa cookies är nödvändiga för att webbplatsen ska fungera, medan andra är valfria och kan avböjas.',
      'Vi använder Google Analytics för att förstå hur besökare använder vår webbplats. Data är avidentifierad och hjälper oss att förbättra tjänsterna.',
    ],
  },
  {
    heading: 'Delning av uppgifter',
    paragraphs: [
      'Vi delar dina personuppgifter endast när det är nödvändigt för att leverera tjänster eller när vi är juridiskt förpliktade att göra det.',
      'Vi kan dela information med:',
      '• Fraktbolag för leverans av dina varor\n• Betalningsleverantörer för att behandla betalningar\n• Kundtjänstpartners för support\n• Myndigheter eller brottsbekämpare när det krävs enligt lag',
      'Vi säljer aldrig dina personuppgifter till tredje part för marknadsföring.',
    ],
  },
  {
    heading: 'DataBRESAches och incidenter',
    paragraphs: [
      'Om en datasäkerhetsincident inträffar som kan påverka din integritet, informerar vi dig inom 30 dagar enligt GDPR.',
      'Vi har åtgärder på plats för att minimera risken för sådana incidenter genom regelbundna säkerhetskontroller och uppdateringar.',
    ],
  },
  {
    heading: 'Ändringar i denna policy',
    paragraphs: [
      'Vi kan uppdatera denna integritetsregler från tid till tid för att återspegla ändringar i våra metoder eller lagkrav.',
      'Betydande ändringar meddelas via e-post eller meddelande på vår webbplats. Din fortsatta användning av vår tjänst efter ändringar betyder att du accepterar den uppdaterade policyn.',
    ],
  },
  {
    heading: 'Kontakta oss',
    paragraphs: [
      'Om du har frågor om denna integritetsregler eller hur vi hanterar dina personuppgifter, kontakta oss:',
      'E-post: info@vikingfuel.se\nAdress: SmartVal AB, Sverige\nResponstid: Vi svarar inom 1–2 arbetsdagar.',
    ],
  },
];

export default function PrivacyPolicyContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Integritetspolicy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi värnar om din personliga integritet och är transparenta om hur vi hanterar dina data. Läs vår kompletta dataskyddspolicy nedan.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map((section) => (
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
          <h3 className="text-xl font-bold text-foreground mb-4">📋 Dataskyddsmyndigheten</h3>
          <p className="text-muted-foreground">
            Om du anser att vi inte följer denna policy eller bryter mot dataskyddslagstiftningen, har du rätt att lämna klagomål till Datainspektionen (IMY).
          </p>
        </div>
      </div>
    </main>
  );
}