'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

const ingredients = [
  {
    name: 'Maca',
    desc: 'Andinska superrot för uthållighet och energi',
    icon: 'SunIcon',
  },
  {
    name: 'Ashwagandha',
    desc: 'Adaptogen som reducerar stress och ökar styrka',
    icon: 'SparklesIcon',
  },
  {
    name: 'Tribulus',
    desc: 'Stödjer testosteronnivåer och vitalitet',
    icon: 'BoltIcon',
  },
  {
    name: 'Panax Ginseng',
    desc: 'Klassisk ört för mental klarhet och fokus',
    icon: 'BeakerIcon',
  },
  {
    name: 'Ingefära',
    desc: 'Anti-inflammatorisk och stödjer matsmältning',
    icon: 'FireIcon',
  },
  {
    name: 'Zink',
    desc: 'Essentiellt mineral för immunförsvar och hormoner',
    icon: 'ShieldCheckIcon',
  },
  {
    name: 'Selen',
    desc: 'Antioxidant som skyddar celler mot oxidativ stress',
    icon: 'StarIcon',
  },
  {
    name: 'Piperin',
    desc: 'Svartpepparextrakt som ökar biotillgängligheten',
    icon: 'ArrowUpIcon',
  },
];

export default function IngredientsSection() {
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
          <span className="section-label block mb-3">Ingredienser</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 text-balance">
            Naturliga ingredienser med premiumkänsla
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Varje ingrediens är noggrant utvald för maximal effekt och transparens.
          </p>
        </motion.div>

        {/* Grid: 4 cols desktop, 2 cols mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
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
