'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-foreground rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Bästa erbjudande
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 text-balance">
              Börja din resa idag
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">Gå med tusentals nöjda kunder som har förbättrat sin hälsa och prestation med våra naturliga kosttillskott.</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full text-base hover:bg-green-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Handla nu
                <Icon name="ArrowRightIcon" size={18} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-full text-base hover:bg-white/20 transition-all"
              >
                Se paket
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
