'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

const stats = [
  { value: '200+', label: 'Nöjda kunder' },
  { value: '8', label: 'Aktiva ingredienser' },
  { value: 'EU', label: 'Tillverkning' },
  { value: '2024', label: 'Grundat' },
];

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1c8cf3b77-1773878735596.png"
                alt="Athletic man training in well-lit modern gym, bright airy environment, open space"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Stats overlay card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-border p-6 grid grid-cols-2 gap-4 max-w-[240px]">
              {stats?.map((stat) => (
                <div key={stat?.label} className="text-center">
                  <p className="text-xl font-extrabold text-primary">{stat?.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{stat?.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label block mb-4">Om Viking Fuel</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight text-balance">
              Byggt för daglig prestation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Viking Fuel är ett nordiskt premiumvarumärke inom kosttillskott. Vi kombinerar stark
              identitet, tydliga ingredienser och modern design för människor som vill ha mer
              energi, uthållighet och vitalitet i vardagen.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Varje kapsel innehåller noggrant utvalda naturliga ingredienser i rätt dosering — utan
              onödiga tillsatser. Tillverkat i EU enligt GMP-standard.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Naturliga ingredienser utan onödiga tillsatser',
                'Tillverkat i EU enligt GMP-standard',
                'Transparenta ingredienslistor',
                'Fri från gluten och laktos',
              ]?.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Icon name="CheckIcon" size={12} className="text-primary" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/#about" className="btn-primary">
              {t?.buttons?.readMore} om oss
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
