'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';

export default function TakeControlCTA() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  return (
    <section className="relative overflow-hidden bg-[#12100b]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/cta-warrior.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
          loading="lazy"
          onError={(e) => { if (!e.currentTarget.src.endsWith('cta-viking.png')) e.currentTarget.src = '/assets/images/cta-viking.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b07] via-[#0d0b07]/85 to-[#0d0b07]/40" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 md:flex-row md:justify-between md:py-24">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <h2 className="font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#f3efe6]" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            {en ? (
              <>Take control.<br />Become your strongest self.</>
            ) : (
              <>Ta kontrollen.<br />Bli din starkaste version.</>
            )}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#cfc7b6]">
            {en
              ? '+Testo-Support is your daily partner for strength, balance and performance.'
              : '+Testo-Support är din dagliga partner för styrka, balans och prestation.'}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#2f6b4a] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#3a8259] hover:-translate-y-0.5"
          >
            {en ? 'Order now' : 'Beställ nu'}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </motion.div>

        {/* Bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-40 flex-shrink-0 sm:w-52"
        >
          <AppImage
            src="/assets/images/viking-energy-1e.png"
            alt="Viking Fuel +Testo Support"
            width={280}
            height={360}
            className="h-auto w-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
