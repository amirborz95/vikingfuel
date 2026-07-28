'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQContent() {
  const { t } = useLanguage();
  const faqs = [
    { question: t('faqPage.q1'), answer: t('faqPage.a1') },
    { question: t('faqPage.q2'), answer: t('faqPage.a2') },
    { question: t('faqPage.q3'), answer: t('faqPage.a3') },
  ];

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">{t('faqPage.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('faqPage.sub')}</p>
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