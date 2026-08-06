'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const GOLD = '#c9a24a';

const items = [
  {
    title: 'Ökad energi',
    titleEn: 'More energy',
    desc: 'Bidrar till mer energi, mindre trötthet och bättre fysisk uthållighet.',
    descEn: 'Supports more energy, less fatigue and better physical stamina.',
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />,
  },
  {
    title: 'Hormonell balans',
    titleEn: 'Hormonal balance',
    desc: 'Innehåller zink som bidrar till normal testosteronnivå i blodet.',
    descEn: 'Contains zinc, which contributes to normal testosterone levels in the blood.',
    icon: (
      <g>
        <circle cx="10" cy="14" r="6" /><path d="M14.5 9.5 21 3" /><path d="M16 3h5v5" />
      </g>
    ),
  },
  {
    title: 'Prestation & fokus',
    titleEn: 'Performance & focus',
    desc: 'Stödjer fokus, mental skärpa och fysisk prestation – varje dag.',
    descEn: 'Supports focus, mental sharpness and physical performance — every day.',
    icon: (
      <g>
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </g>
    ),
  },
  {
    title: 'Säker & ren kvalitet',
    titleEn: 'Safe & clean quality',
    desc: 'Noggrant utvalda ingredienser utan onödiga tillsatser.',
    descEn: 'Carefully selected ingredients with no unnecessary additives.',
    icon: <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />,
  },
];

export default function HomeFeatures4() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  return (
    <section className="bg-[#17150f] py-14 lg:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 lg:grid-cols-4 lg:divide-x lg:divide-white/10 lg:gap-y-0 lg:px-0">
        {items.map((it) => (
          <div key={it.title} className="px-6 text-center">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ borderColor: `${GOLD}55`, color: GOLD }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
            </div>
            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.15em]" style={{ color: GOLD }}>{en ? it.titleEn : it.title}</h3>
            <p className="mx-auto max-w-[230px] text-[13px] leading-relaxed text-[#9c9483]">{en ? it.descEn : it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
