'use client';

import React from 'react';

const sections = [
  {
    heading: 'Insamling av personuppgifter',
    paragraphs: [
      'Vi samlar endast in den information som behövs för att behandla din beställning och ge dig god kundservice.',
      'Det kan inkludera namn, e-postadress, telefonnummer, adress och orderinformation.',
    ],
  },
  {
    heading: 'Hur vi använder informationen',
    paragraphs: [
      'Informationen används för att behandla order, leverera produkter och ge support.',
      'Vi använder även uppgifter för att skicka orderbekräftelser och fraktinformation.',
    ],
  },
  {
    heading: 'Lagring och säkerhet',
    paragraphs: [
      'Vi lagrar dina uppgifter på säkra servrar och vidtar åtgärder för att skydda dem mot obehörig åtkomst.',
      'Personuppgifter sparas endast så länge det är nödvändigt för ändamålet.',
    ],
  },
  {
    heading: 'Dina rättigheter',
    paragraphs: [
      'Du har rätt att begära rättning, radering eller tillgång till dina uppgifter.',
      'Kontakta oss om du vill uppdatera eller ta bort dina personuppgifter.',
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
            Vi värnar om din personliga integritet och beskriver här hur vi samlar in och behandlar dina uppgifter.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}