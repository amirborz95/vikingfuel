'use client';

import React from 'react';

const items = [
  {
    title: 'Transparent formula',
    desc: 'Inga proprietära blandningar. Du ser exakt vad du får.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-9V3" /><path d="M7.5 14h9" />
      </g>
    ),
  },
  {
    title: 'Noga utvalda ingredienser',
    desc: 'Ingredienser valda med fokus på kvalitet och transparens.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4c-8 0-14 5-14 12 0 2 .5 4 .5 4S16 20 20 4z" /><path d="M6 20c2-6 6-9 11-11" />
      </g>
    ),
  },
  {
    title: 'Skandinaviskt varumärke',
    desc: 'Designad med nordisk enkelhet och styrka.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" />
      </g>
    ),
  },
  {
    title: 'Premiumkvalitet',
    desc: 'Producerad enligt strikta kvalitetskrav i EU.',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" /><path d="M9 14l-2 7 5-3 5 3-2-7" /><path d="M9.5 9l1.8 1.8L15 7" />
      </g>
    ),
  },
];

export default function HomeFeatures4() {
  return (
    <section className="border-t border-white/5 bg-[#100f0b] py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#4f9d72]/30 bg-[#4f9d72]/10 text-[#4f9d72]">
              <svg viewBox="0 0 24 24" className="h-6 w-6">{it.icon}</svg>
            </div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#f3efe6]">{it.title}</h3>
            <p className="mx-auto max-w-[220px] text-xs leading-relaxed text-[#9c9483]">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
