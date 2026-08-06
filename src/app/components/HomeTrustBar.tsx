'use client';

import React from 'react';

const items = [
  {
    title: 'Snabb leverans',
    sub: '1–3 arbetsdagar',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" />
      </g>
    ),
  },
  {
    title: 'Säker betalning',
    sub: 'Kort, Apple & Google Pay',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
      </g>
    ),
  },
  {
    title: 'Nöjdhetsgaranti',
    sub: '30 dagars öppet köp',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" />
      </g>
    ),
  },
  {
    title: 'Kundtjänst',
    sub: 'Vi finns här för dig',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 1 1 21 11.5z" />
      </g>
    ),
  },
];

export default function HomeTrustBar() {
  return (
    <section className="border-t border-border bg-white py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5">{it.icon}</svg>
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
