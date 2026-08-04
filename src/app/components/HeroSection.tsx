'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HERO_IMG = 'https://i.postimg.cc/SQZ7ycXV/Chat-GPT-Image-Jun-4-2026-01-35-12-PM.png';

const trust = [
  'Tillverkad i EU',
  'Premium ingredienser',
  '60 kapslar',
  'Fri frakt över 700 kr',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#17150f] flex flex-col justify-between">
      {/* Background warrior image */}
      <div className="absolute inset-0 z-0">
        <img src={HERO_IMG} alt="Viking warrior" className="h-full w-full object-cover object-[70%_center]" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#100f0b] via-[#100f0b]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100f0b] via-transparent to-[#100f0b]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center px-6 sm:px-10 lg:px-16 xl:px-24 pt-28 pb-10">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#f3efe6]"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
          >
            Fuel your<br />inner viking
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-[#cfc7b6]"
          >
            Premium nordiskt kosttillskott utvecklat för män som kräver mer av sig själva.
            Naturliga ingredienser. Transparent formula. Inga kompromisser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-sm bg-[#9c8e6f] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#17150f] transition-all hover:bg-[#b0a284] hover:-translate-y-0.5"
            >
              Shoppa nu
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-sm border border-[#cfc7b6]/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#f3efe6] transition-all hover:border-[#cfc7b6] hover:-translate-y-0.5"
            >
              Läs om formulan
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#100f0b]/70 backdrop-blur-sm">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-y-3 px-6 py-5 sm:grid-cols-4 sm:px-10 lg:px-16 xl:px-24">
          {trust.map((item) => (
            <div key={item} className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#cfc7b6]">
              <svg className="h-4 w-4 flex-shrink-0 text-[#9c8e6f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
