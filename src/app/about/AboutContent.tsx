'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutContent() {
  const { t } = useLanguage();
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
              {t('aboutPage.heroTitle')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('aboutPage.heroSub')}
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
              <span className="section-label block mb-4">{t('aboutPage.historyTitle')}</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                {t('aboutPage.storyH2')}
              </h2>

              {[t('aboutPage.p1'), t('aboutPage.p2')].map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}

              <ul className="space-y-3 mb-10">
                {[
                  t('aboutPage.b0'),
                  t('aboutPage.b1'),
                  t('aboutPage.b2'),
                  t('aboutPage.b3'),
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
            <span className="section-label block mb-4">{t('aboutPage.valuesTitle')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              {t('aboutPage.valuesH2')}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('aboutPage.valuesSub')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t('aboutPage.v1t'), description: t('aboutPage.v1d'), icon: 'ShieldCheckIcon' },
              { title: t('aboutPage.v2t'), description: t('aboutPage.v2d'), icon: 'EyeIcon' },
              { title: t('aboutPage.v3t'), description: t('aboutPage.v3d'), icon: 'LightBulbIcon' },
              { title: t('aboutPage.v4t'), description: t('aboutPage.v4d'), icon: 'LeafIcon' },
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
            <span className="section-label block mb-4">{t('aboutPage.missionTitle')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              {t('aboutPage.missionH2')}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              {t('aboutPage.missionSub')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: t('aboutPage.m1t'), description: t('aboutPage.m1d'), icon: 'LeafIcon' },
              { title: t('aboutPage.m2t'), description: t('aboutPage.m2d'), icon: 'BeakerIcon' },
              { title: t('aboutPage.m3t'), description: t('aboutPage.m3d'), icon: 'UserGroupIcon' },
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
            <h3 className="text-2xl font-bold text-foreground mb-4">{t('aboutPage.whyTitle')}</h3>
            <p className="text-lg text-muted-foreground mb-4">{t('aboutPage.whyP1')}</p>
            <p className="text-lg text-muted-foreground">{t('aboutPage.whyP2')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}