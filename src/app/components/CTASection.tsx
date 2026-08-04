'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-foreground rounded-3xl px-8 py-20 md:px-16 md:py-28 text-center ring-1 ring-white/10"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/cta-viking.png')" }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6 ring-1 ring-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('home.cta.badge')}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 text-balance">{t('home.cta.title')}</h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">{t('home.cta.desc')}</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full text-base shadow-lg shadow-primary/30 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('home.cta.shopNow')}
                <Icon name="ArrowRightIcon" size={18} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-full text-base hover:bg-white/20 transition-all"
              >{t('home.cta.seeBundles')}</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
