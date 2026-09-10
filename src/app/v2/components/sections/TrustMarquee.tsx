import React from 'react';

const ITEMS = [
  'Fri frakt över 649 kr',
  'Tillverkad i EU',
  '14 dagars öppet köp',
  'Inga onödiga tillsatser',
  'Tredjepartstestad',
  'Snabb leverans 1–3 dagar',
];

export default function TrustMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="vf-marquee-wrap relative flex h-[68px] items-center overflow-hidden bg-forest">
      <div className="vf-marquee flex w-max shrink-0 items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {row.map((item, i) => (
              <span key={`${dup}-${i}`} className="flex items-center whitespace-nowrap">
                <span className="font-ui text-[12px] uppercase tracking-[0.18em] text-birch/90">{item}</span>
                <span className="mx-8 text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
