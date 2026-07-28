'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

const ingredientMeta: { key: string; icon: string }[] = [
  { key: 'maca', icon: 'SunIcon' },
  { key: 'ashwagandha', icon: 'SparklesIcon' },
  { key: 'tribulus', icon: 'BoltIcon' },
  { key: 'ginseng', icon: 'BeakerIcon' },
  { key: 'ginger', icon: 'FireIcon' },
  { key: 'zinc', icon: 'ShieldCheckIcon' },
  { key: 'selenium', icon: 'StarIcon' },
  { key: 'piperine', icon: 'ArrowUpIcon' },
];

export default function IngredientsSection() {
  const { t } = useLanguage();
  const ingredients = ingredientMeta.map((m) => ({
    key: m.key,
    icon: m.icon,
    name: t(`ingredients.items.${m.key}.name`),
    desc: t(`ingredients.items.${m.key}.desc`),
  }));
  return (
    <section id="ingredients" className="py-20 bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label block mb-3">{t('ingredients.label')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 text-balance">
            {t('ingredients.heading')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('ingredients.sub')}
          </p>
        </motion.div>

        {/* Grid: 4 cols desktop, 2 cols mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-product transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <Icon
                  name={ing.icon as any}
                  size={20}
                  className="text-primary group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="font-bold text-foreground text-base mb-1">{ing.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{ing.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
