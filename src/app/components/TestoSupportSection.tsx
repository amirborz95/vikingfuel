'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const ingredients = [
  ['Maca', 'Ashwagandha', 'Tribulus', 'Fenugreek', 'Panax Ginseng', 'Pine Bark'],
  ['Royal Jelly', 'Ginger', 'Zinc', 'Selenium', 'Boron', 'Piperine'],
];

export default function TestoSupportSection() {
  return (
    <section className="bg-[#17150f] py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Bottle */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 -z-0 rounded-full bg-[#9c8e6f]/10 blur-3xl" />
            <AppImage
              src="/assets/images/testo-bottle.png"
              fallbackSrc="/assets/images/viking-energy-1e.png"
              alt="Viking Fuel +Testo Support"
              width={640}
              height={520}
              className="relative z-10 mx-auto h-auto w-full rounded-2xl object-cover drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="font-extrabold uppercase leading-none tracking-[-0.02em] text-[#f3efe6]" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            +Testo Support
          </h2>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#9c8e6f]">Vad innehåller den?</p>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
            {ingredients.flat().map((ing) => (
              <div key={ing} className="flex items-center gap-2.5 text-[#e0d9c9]">
                <svg className="h-4 w-4 flex-shrink-0 text-[#9c8e6f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-sm">{ing}</span>
              </div>
            ))}
          </div>

          <Link
            href="/product-detail"
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-[#9c8e6f] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#9c8e6f] transition-all hover:bg-[#9c8e6f] hover:text-[#17150f]"
          >
            Se alla ingredienser
          </Link>
        </div>
      </div>
    </section>
  );
}
