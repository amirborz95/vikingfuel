'use client';

import React from 'react';

const IG_URL = 'https://www.instagram.com/vikingfuel.se/';

const photos = [
  '/assets/images/community-1.png',
  '/assets/images/community-2.png',
  '/assets/images/community-3.png',
  '/assets/images/community-4.png',
];

export default function InstagramCommunity() {
  return (
    <section className="border-t border-white/5 bg-[#17150f] pt-16 pb-0">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.05em] text-[#f3efe6]">Join the viking community</h2>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-[#4f9d72] hover:text-[#6bbf90]">
          Följ oss på Instagram @vikingfuel.se
        </a>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-2 px-6 pb-14 sm:grid-cols-4">
        {photos.map((src, i) => (
          <a
            key={i}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-[#100f0b]"
          >
            <img
              src={src}
              alt="Viking Fuel community"
              loading="lazy"
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
