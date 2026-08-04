'use client';

import React from 'react';

const IG_URL = 'https://www.instagram.com/vikingfuel.se/';

export default function InstagramCommunity() {
  return (
    <section className="bg-[#17150f] pt-14 pb-0">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.05em] text-[#f3efe6]">Join the viking community</h2>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-[#4f9d72] hover:text-[#6bbf90]">
          Följ oss på Instagram @vikingfuel.se
        </a>
      </div>

      {/* Community banner (4-panel lifestyle image). Swap the file to update. */}
      <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="group mt-8 block overflow-hidden">
        <img
          src="/assets/images/community.png"
          alt="Viking Fuel community"
          className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          loading="lazy"
          onError={(e) => { if (!e.currentTarget.src.endsWith('cta-viking.png')) e.currentTarget.src = '/assets/images/cta-viking.png'; }}
        />
      </a>
    </section>
  );
}
