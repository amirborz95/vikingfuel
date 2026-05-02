'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

const trustItemIcons = ['TruckIcon', 'ShieldCheckIcon', 'ArrowPathIcon', 'SparklesIcon', 'BoltIcon'];

export default function HeroSection() {
  const { t } = useLanguage();
  const trustItems = t.trustBenefits.items.map((item, index) => ({
    ...item,
    icon: trustItemIcons[index] as any,
  }));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[88vh] flex flex-col justify-between">
        {/* Full-width background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/70d535ec-5470-4338-9e8a-268edfc167ce-1777151317296.png"
            alt="Viking Fuel hero background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        </div>

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* ── MASSIVE HEADLINE — top of section ── */}
        <div className="relative z-10 pt-10 lg:pt-14 px-4 sm:px-8 lg:px-16 xl:px-24 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white select-none"
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              WebkitTextStroke: '1px rgba(255,255,255,0.08)',
            }}
          >
            VIKING
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold uppercase leading-[0.88] tracking-[-0.03em] select-none"
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.55)',
            }}
          >
            FUEL
          </motion.h1>
        </div>

        {/* ── BOTTOM ROW: text left ── */}
        <div className="relative z-10 flex items-end justify-between px-4 sm:px-8 lg:px-16 xl:px-24 pb-0">
          {/* Left: subtitle + CTA */}
          <div className="max-w-[480px] pb-14 lg:pb-20 flex-shrink-0">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#16a34a] mb-3"
            >
              {t.hero.premiumTag}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-bold text-xl sm:text-2xl lg:text-3xl leading-[1.2] tracking-[-0.01em] mb-3"
            >
              {t.hero.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#e2e8f0] text-sm sm:text-base leading-relaxed mb-7"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#f1f5f9] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded-none transition-all duration-200 hover:-translate-y-0.5"
              >
                {t.buttons.shopNow}
                <Icon name="ArrowRightIcon" size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-white/40 hover:border-white/80 text-white font-semibold text-sm px-6 py-3 rounded-none transition-all duration-200 hover:-translate-y-0.5"
              >
                {t.buttons.readMore}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-[#111111] border-t border-white/5">
        <div className="container-wide">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/5">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.07 }}
                className="flex items-center gap-3 px-5 py-5"
              >
                <Icon name={item.icon as any} size={20} className="text-[#16a34a] flex-shrink-0" />
                <div>
                  <p className="text-white text-[13px] font-semibold leading-tight">{item.label}</p>
                  <p className="text-[#64748b] text-[11px] mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
