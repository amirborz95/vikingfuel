'use client';

import React from 'react';

const items = [
  {
    title: 'Stödjer din prestation',
    desc: 'Stödjer energi och prestationsförmåga som en del av en hälsosam livsstil.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
      </g>
    ),
  },
  {
    title: 'Främjar vitaliteten',
    desc: 'Noggrant utvalda växtextrakt och mineraler.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="14" r="6" /><path d="M14.5 9.5 21 3" /><path d="M16 3h5v5" />
      </g>
    ),
  },
  {
    title: '10 noga utvalda',
    desc: 'Full transparens. Varje ingrediens och dos finns på etiketten.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4c-8 0-14 5-14 12 0 2 .5 4 .5 4S16 20 20 4z" /><path d="M6 20c2-6 6-9 11-11" />
      </g>
    ),
  },
];

export default function HomeFeatures3() {
  return (
    <section className="border-t border-white/5 bg-[#17150f] py-16 lg:py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 lg:gap-12">
        {items.map((it) => (
          <div key={it.title} className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#4f9d72]/30 bg-[#4f9d72]/10 text-[#4f9d72]">
              <svg viewBox="0 0 24 24" className="h-6 w-6">{it.icon}</svg>
            </div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-[#f3efe6]">{it.title}</h3>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#9c9483]">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
