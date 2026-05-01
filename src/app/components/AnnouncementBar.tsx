'use client';

import React from 'react';
import Marquee from 'react-fast-marquee';

const items = [
  'Fri frakt över 500 kr',
  '10% rabatt på första beställningen',
  'Säker betalning',
  'Snabb leverans',
  'Tillverkat i EU',
  'Premium ingredienser',
  '30 dagars nöjdhetsgaranti',
];

export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-white py-2.5 text-xs font-medium">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {items?.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
