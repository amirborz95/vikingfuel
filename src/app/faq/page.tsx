import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: 'Vad är Viking Fuel?',
    answer: 'Viking Fuel är ett premiumtillskott från Norden som hjälper dig att prestera bättre varje dag med naturliga ingredienser.'
  },
  {
    question: 'Hur tar jag produkten?',
    answer: 'Ta 1 kapsel per dag med vatten, helst på morgonen eller innan träning.'
  },
  {
    question: 'Är produkten säker?',
    answer: 'Ja, alla våra produkter är tillverkade i EU enligt högsta säkerhetsstandarder med naturliga ingredienser.'
  },
  {
    question: 'Kan jag kombinera med andra tillskott?',
    answer: 'Konsultera alltid en läkare innan du kombinerar tillskott. Våra produkter är designade för dagligt bruk.'
  },
];

export default function FAQPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Vanliga frågor</h1>
                <p className="text-lg text-muted-foreground">Här hittar du svar på de vanligaste frågorna om våra produkter.</p>
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
          <Footer />
        </div>  );
}