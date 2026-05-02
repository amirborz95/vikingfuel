'use client';

import React from 'react';
import Marquee from 'react-fast-marquee';
'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-foreground text-white py-2.5 text-xs font-medium">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {t.announcement.items?.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
