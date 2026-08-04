'use client';

import React from 'react';
import Link from 'next/link';

const ingredients = [
  ['Maca', 'Ashwagandha', 'Tribulus', 'Fenugreek', 'Panax Ginseng', 'Pine Bark'],
  ['Royal Jelly', 'Ginger', 'Zinc', 'Selenium', 'Boron', 'Piperine'],
];

export default function TestoSupportSection() {
  return (
    <section className="border-t border-white/5 bg-[#17150f]">
      <div className="grid items-stretch lg:grid-cols-2">
        {/* Bottle — full-bleed on the left */}
        <div className="relative min-h-[340px] lg:min-h-[560px]">
          <img
            src="/assets/images/testo-bottle.png"
            alt="Viking Fuel +Testo Support"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { if (!e.currentTarget.src.endsWith('viking-energy-1e.png')) e.currentTarget.src = '/assets/images/viking-energy-1e.png'; }}
          />
        </div>

        {/* Ingredients — right */}
        <div className="flex items-center px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div className="w-full">
            <h2 className="font-extrabold uppercase leading-none tracking-[-0.02em] text-[#f3efe6]" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
              +Testo Support
            </h2>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#4f9d72]">Vad innehåller den?</p>

            <div className="mt-5 grid max-w-lg grid-cols-2 gap-x-8 gap-y-3.5">
              {ingredients.flat().map((ing) => (
                <div key={ing} className="flex items-center gap-2.5 text-[#e0d9c9]">
                  <svg className="h-5 w-5 flex-shrink-0 text-[#4f9d72]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="8.5 12.5 11 15 16 9" />
                  </svg>
                  <span className="text-sm">{ing}</span>
                </div>
              ))}
            </div>

            <Link
              href="/product-detail"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#2f6b4a] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#3a8259]"
            >
              Se alla ingredienser
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
