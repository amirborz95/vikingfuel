'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ForgedInNorth() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#17150f]">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/forged-viking.png"
          alt="Viking warrior in the north"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          onError={(e) => { if (!e.currentTarget.src.endsWith('cta-viking.png')) e.currentTarget.src = '/assets/images/cta-viking.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#100f0b]/40 via-[#100f0b]/70 to-[#100f0b]/90" />
      </div>

      <div className="relative z-10 flex min-h-[60vh] items-center justify-end px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-right"
        >
          <h2 className="font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#f3efe6]" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)' }}>
            Forged in<br />the north
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#cfc7b6]">
            Inte skapad för alla. Skapad för män som tränar hårt, arbetar hårt
            och aldrig nöjer sig med medelmåttighet.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
