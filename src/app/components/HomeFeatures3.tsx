'use client';

import React from 'react';

const items = [
  {
    title: 'Performance',
    desc: 'Stödjer energi och prestationsförmåga som en del av en hälsosam livsstil.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l6 6M4 8l4-4M2 10l4-4" /><path d="M20 4l-6 6M20 8l-4-4M22 10l-4-4" /><path d="M12 12l0 8M9 20h6" />
      </g>
    ),
  },
  {
    title: 'Premium ingredients',
    desc: 'Noggrant utvalda växtextrakt och mineraler.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4c-8 0-14 5-14 12 0 2 .5 4 .5 4S16 20 20 4z" /><path d="M6 20c2-6 6-9 11-11" />
      </g>
    ),
  },
  {
    title: 'No hidden blends',
    desc: 'Full transparens. Varje ingrediens och dos finns på etiketten.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
];

export default function HomeFeatures3() {
  return (
    <section className="bg-[#e8e1d4] py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-3 lg:gap-14">
        {items.map((it) => (
          <div key={it.title} className="text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center text-[#2a271f]">
              <svg viewBox="0 0 24 24" className="h-9 w-9">{it.icon}</svg>
            </div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#2a271f]">{it.title}</h3>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#6b6456]">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
