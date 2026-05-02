'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
'use client';

import { useLanguage } from '@/context/LanguageContext';

const benefitIcons = ['TruckIcon', 'LockClosedIcon', 'BoltIcon', 'ArrowPathIcon', 'SparklesIcon'];

export default function TrustBenefits() {
  const { t } = useLanguage();
  const benefits = t.trustBenefits.items.map((item, index) => ({
    ...item,
    icon: benefitIcons[index] as any,
  }));

  return (
    <section className="py-10 border-y border-border bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-2 py-4"
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Icon name={b.icon as any} size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
