'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';

// Placeholder grid — swap these for real Instagram photos when available.
const photos = [
  '/assets/images/cta-viking.png',
  '/assets/images/viking-energy-3e.png',
  'https://i.postimg.cc/SQZ7ycXV/Chat-GPT-Image-Jun-4-2026-01-35-12-PM.png',
  '/assets/images/viking-energy-6e.png',
  '/assets/images/viking-energy-1e.png',
];

const IG_URL = 'https://www.instagram.com/vikingfuel.se/';

export default function InstagramCommunity() {
  return (
    <section className="bg-[#17150f] pt-14 pb-0">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.05em] text-[#f3efe6]">Join the viking community</h2>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-[#9c8e6f] hover:text-[#b0a284]">
          Följ oss på Instagram @vikingfuel.se
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((src, i) => (
          <a
            key={i}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative aspect-square overflow-hidden bg-[#100f0b] ${i === 4 ? 'hidden sm:block' : ''} ${i >= 3 ? 'lg:block' : ''}`}
          >
            <AppImage
              src={src}
              alt="Viking Fuel community"
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
              <svg className="h-7 w-7 text-white opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
