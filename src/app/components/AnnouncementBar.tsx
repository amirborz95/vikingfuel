'use client';

import React from 'react';
import Marquee from 'react-fast-marquee';

export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-white py-2.5 text-xs font-medium">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {[
          'Fri frakt över 500 kr',
          'Snabb leverans inom Sverige',
          '14 dagar ångerrätt',
          'Naturliga kosttillskott från Norden',
        ].map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
