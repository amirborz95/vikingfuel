'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Om Viking Fuel
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Upptäck vår resa från passion för naturliga kosttillskott till att skapa premiumprodukter som förbättrar människors liv.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
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
            </motion.div>

            {/* Right — Text */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-label block mb-4">Vår historia</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Från passion till perfektion
              </h2>

              {[
                'Viking Fuel började som en dröm om att skapa naturliga kosttillskott som verkligen fungerar. Grundaren, med bakgrund inom idrott och näring, insåg att många produkter på marknaden inte levde upp till sina löften.',
                'Efter år av forskning och utveckling lanserade vi vår första produkt 2025. Sedan dess har vi hjälpt tusentals människor att nå sina mål genom våra vetenskapligt utformade formler.',
              ].map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}

              <ul className="space-y-3 mb-10">
                {[
                  '100% naturliga ingredienser',
                  'Vetenskapligt bevisade resultat',
                  'Tillverkad i EU',
                  'GMP-certifierad produktion',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Icon name="CheckIcon" size={12} className="text-primary" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="section-label block mb-4">Våra värderingar</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              Vad som driver oss
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Vi tror på kraften i naturen kombinerat med modern vetenskap för att skapa produkter som verkligen gör skillnad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Kvalitet först', description: 'Vi kompromissar aldrig med kvaliteten på våra ingredienser eller tillverkningsprocesser.', icon: 'ShieldCheckIcon' },
              { title: 'Transparens', description: 'Vi är öppna om våra ingredienser, processer och resultat.', icon: 'EyeIcon' },
              { title: 'Innovation', description: 'Vi investerar kontinuerligt i forskning för att förbättra våra produkter.', icon: 'LightBulbIcon' },
              { title: 'Hållbarhet', description: 'Vi arbetar för att minimera vår miljöpåverkan genom hela värdekedjan.', icon: 'LeafIcon' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name={value.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="section-label block mb-4">Vårt uppdrag</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              Att förbättra människors liv genom naturliga kosttillskott
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Vårt uppdrag är enkelt men djupt: att skapa kosttillskott som hjälper människor att leva hälsosammare, mer energiska liv genom kraften i naturen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Naturliga lösningar', description: 'Vi använder endast naturliga ingredienser som har bevisad effekt.', icon: 'LeafIcon' },
              { title: 'Vetenskaplig grund', description: 'Alla våra produkter är baserade på vetenskaplig forskning och kliniska studier.', icon: 'BeakerIcon' },
              { title: 'Personlig service', description: 'Vi erbjuder personlig rådgivning och support för alla våra kunder.', icon: 'UserGroupIcon' },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name={card.icon} size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-12"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">Varför välja Viking Fuel?</h3>
            <p className="text-lg text-muted-foreground mb-4">Med över 10 000 nöjda kunder och 4.8/5 i kundnöjdhet vet vi att våra produkter fungerar. Men det är inte bara resultaten som räknas - det är också resan.</p>
            <p className="text-lg text-muted-foreground">Varje dag hör vi från människor vars liv har förbättrats tack vare våra kosttillskott. Tillsammans bygger vi framtiden för naturliga kosttillskott i Norden.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}