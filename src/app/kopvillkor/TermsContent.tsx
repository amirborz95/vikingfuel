'use client';

import React from 'react';

const sections = [
  {
    heading: 'Allmänna villkor',
    paragraphs: [
      'Genom att använda vår webbplats godkänner du dessa villkor.',
      'Vi förbehåller oss rätten att ändra villkoren vid behov.',
    ],
  },
  {
    heading: 'Beställningar',
    paragraphs: [
      'Order bekräftas via e-post efter att den har mottagits.',
      'Vi gör vårt bästa för att hålla lagersaldot uppdaterat, men reservation kan förekomma.',
    ],
  },
  {
    heading: 'Betalning',
    paragraphs: [
      'Betalningen sker säkert via våra valda betalningsleverantörer.',
      'Vi accepterar de betalningsmetoder som visas i kassan.',
    ],
  },
  {
    heading: 'Ansvarsbegränsning',
    paragraphs: [
      'Vi ansvarar inte för indirekta skador som uppstår vid användning av produkterna.',
      'Vi strävar efter att informationen på sidan ska vara korrekt, men kan ej garantera att den är heltäckande.',
    ],
  },
];

export default function TermsContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Köpvillkor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Läs våra villkor för köp, betalning och leverans.
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