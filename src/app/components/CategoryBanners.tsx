'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoryBanners() {
  const { t } = useLanguage();
  const categories = [
    {
      title: t('banners.energyTitle'),
      subtitle: t('banners.energySub'),
      btnLabel: t('banners.energyBtn'),
      btnHref: '/products',
      image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dfdba63f-1766878590962.png',
      alt: 'Athletic man in dark gym setting with dramatic lighting and strong shadows, dark industrial background',
      accent: 'from-foreground/70 via-foreground/40 to-transparent',
    },
    {
      title: t('banners.bundlesTitle'),
      subtitle: t('banners.bundlesSub'),
      btnLabel: t('banners.bundlesBtn'),
      btnHref: '/products',
      image: 'https://i.postimg.cc/RFPBsggt/Chat-GPT-Image-Jun-4-2026-01-54-11-PM.png',
      alt: 'Multiple supplement bottles arranged on dark slate surface, moody dim lighting, deep shadows',
      accent: 'from-foreground/70 via-foreground/40 to-transparent',
    },
    {
      title: t('banners.accTitle'),
      subtitle: t('banners.accSub'),
      btnLabel: t('banners.accBtn'),
      btnHref: '#',
      image: 'https://i.postimg.cc/Dz6k0C3F/Chat-GPT-Image-Jun-4-2026-01-54-16-PM.png',
      alt: 'Fitness equipment and shaker bottle on dark gym floor, atmospheric dim lighting, moody shadows',
      accent: 'from-foreground/70 via-foreground/40 to-transparent',
      disabled: true,
    },
  ];
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12 lg:mb-16"
        >
          <span className="section-label">{t('banners.label')}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance">
            {t('banners.heading')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('banners.sub')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories?.map((cat, i) => (
            <motion.div
              key={cat?.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] shadow-product ring-1 ring-black/5 transition-all duration-500 hover:shadow-product-hover hover:-translate-y-1"
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden bg-zinc-900">
                <AppImage
                  src={cat?.image}
                  alt={cat?.alt}
                  width={1200}
                  height={720}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={i === 0}
                  style={{ objectPosition: 'center center' }}
                />
              </div>

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10 transition-opacity duration-500 group-hover:from-black/90" />

              {/* Index number */}
              <span className="absolute top-6 left-6 z-20 text-sm font-bold text-white/50 tabular-nums">
                0{i + 1}
              </span>

              {/* "Coming soon" ribbon */}
              {cat?.disabled && (
                <span className="absolute top-6 right-6 z-20 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/30">
                  {t('banners.accBtn')}
                </span>
              )}

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 z-20">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{cat?.title}</h3>
                <p className="text-base text-white/80 mb-6 max-w-[90%]">{cat?.subtitle}</p>
                {cat?.disabled ? (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-newsletter'))}
                    className="inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white text-foreground transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    {t('banners.notifyBtn')}
                    <Icon name="BellAlertIcon" size={14} />
                  </button>
                ) : (
                  <Link
                    href={cat?.btnHref}
                    className="inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white text-foreground transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    {cat?.btnLabel}
                    <Icon
                      name="ArrowRightIcon"
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
