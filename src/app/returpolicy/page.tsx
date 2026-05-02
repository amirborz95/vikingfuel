'use client';

import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main className="py-20">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">Returpolicy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Här beskriver vi hur du returnerar en vara och vilka villkor som gäller.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {[
              {
                heading: '14 dagars ångerrätt',
                paragraphs: [
                  'Du kan returnera oanvända varor inom 14 dagar efter leverans.',
                  'Returfrakten bekostas av dig om inte annat överenskommits.',
                ],
              },
              {
                heading: 'Returprocess',
                paragraphs: [
                  'Kontakta oss för att få returinstruktioner och returadress.',
                  'Skicka tillbaka produkten i originalförpackning om möjligt.',
                ],
              },
              {
                heading: 'Återbetalning',
                paragraphs: [
                  'När vi mottagit returvaran behandlas återbetalningen inom 5–10 arbetsdagar.',
                  'Återbetalningen sker till samma betalningsmetod som användes vid köpet.',
                ],
              },
            ].map((section) => (
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
      <Footer />
    </div>
  );
}
