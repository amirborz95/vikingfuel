'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const IG_URL = 'https://www.instagram.com/vikingfuel.se/';

const photos = [
  '/assets/images/community-1.png',
  '/assets/images/community-2.jpg',
  '/assets/images/community-3.png',
  '/assets/images/community-4.jpg',
];

export default function InstagramCommunity() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">@vikingfuel.se</p>
        <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">{en ? 'Join our community' : 'Gå med i vår community'}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          {en
            ? 'Share your journey, tag us and become part of the pack. Follow us on Instagram for training tips, offers and inspiration.'
            : 'Dela din resa, tagga oss och bli en del av flocken. Följ oss på Instagram för träningstips, erbjudanden och inspiration.'}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 px-6 sm:grid-cols-4">
        {photos.map((src, i) => (
          <a key={i} href={IG_URL} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img src={src} alt="Viking Fuel community" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
              <svg className="h-7 w-7 text-white opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-[#2f6b4a] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#3a8259]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          {en ? 'Follow us on Instagram' : 'Följ oss på Instagram'}
        </a>
      </div>
    </section>
  );
}
