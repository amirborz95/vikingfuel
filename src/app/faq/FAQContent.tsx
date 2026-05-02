'use client';

import React from 'react';

const faqs = [
  {
    question: 'Hur snabbt levereras min beställning?',
    answer: 'Vi skickar din order inom 1–2 arbetsdagar. Leveranstiden i Sverige är normalt 2–4 dagar efter leveransbekräftelse.',
  },
  {
    question: 'Finns era produkter i Sverige?',
    answer: 'Ja, alla våra produkter finns lagerförda i Sverige och skickas från svensk lagercentral.',
  },
  {
    question: 'Kan jag ångra mitt köp?',
    answer: 'Du har 14 dagars ångerrätt enligt distansköplagen. Kontakta vår kundservice för returinstruktioner.',
  },
];

export default function FAQContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Vanliga frågor</h1>
          <p className="text-lg text-muted-foreground">Här hittar du svar på de vanligaste frågorna om beställning, leverans och produkter.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-muted/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}