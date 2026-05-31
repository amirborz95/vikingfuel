'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const categories = [
  {
    title: 'Energi & Vitalitet',
    subtitle: 'Naturliga ingredienser för maximal energi',
    btnLabel: 'Handla nu',
    btnHref: '/products',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dfdba63f-1766878590962.png',
    alt: 'Athletic man in dark gym setting with dramatic lighting and strong shadows, dark industrial background',
    accent: 'from-foreground/70 via-foreground/40 to-transparent',
  },
  {
    title: 'Paket & Erbjudanden',
    subtitle: 'Spara mer med våra värdepaket',
    btnLabel: 'Se paket',
    btnHref: '/products',
    image: 'https://i.postimg.cc/6pKnyKGZ/Chat-GPT-Image-May-31-2026-12-20-05-PM.png',
    alt: 'Multiple supplement bottles arranged on dark slate surface, moody dim lighting, deep shadows',
    accent: 'from-foreground/70 via-foreground/40 to-transparent',
  },
  {
    title: 'Tillbehör',
    subtitle: 'Kommer snart — prenumerera för uppdateringar',
    btnLabel: 'Kommer snart',
    btnHref: '#',
    image: 'https://i.postimg.cc/WbLJHV8f/Chat-GPT-Image-May-31-2026-12-21-05-PM.png',
    alt: 'Fitness equipment and shaker bottle on dark gym floor, atmospheric dim lighting, moody shadows',
    accent: 'from-foreground/70 via-foreground/40 to-transparent',
    disabled: true,
  },
];

export default function CategoryBanners() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="px-1 sm:px-2 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {categories?.map((cat, i) => (
            <motion.div
              key={cat?.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl overflow-hidden aspect-[5/3]"
            >
              {/* Image */}
              <AppImage
                src={cat?.image}
                alt={cat?.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />

              {/* Scrim */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat?.accent}`} />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{cat?.title}</h3>
                <p className="text-base text-white/80 mb-6">{cat?.subtitle}</p>
                <Link
                  href={cat?.btnHref}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    cat?.disabled
                      ? 'bg-white/30 text-white cursor-default'
                      : 'bg-white text-foreground hover:bg-primary hover:text-white'
                  }`}
                >
                  {cat?.btnLabel}
                  {!cat?.disabled && <Icon name="ArrowRightIcon" size={14} />}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
