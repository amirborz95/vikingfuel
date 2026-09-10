'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../ui';
import { prefersReducedMotion } from '../../lib/motion';

const WORDS = ['Kraft.', 'Fokus.', 'Prestation.'];

/**
 * Dark break. Pins for ~120vh while the three words mask up one at a time and a
 * gold hairline draws across underneath.
 */
export default function BrandFilm() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('[data-word]');
      const rule = el.querySelector('[data-rule]');

      if (reduced) {
        gsap.set(words, { yPercent: 0, opacity: 1 });
        gsap.set(rule, { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: '+=120%', pin: true, scrub: 1 },
      });
      tl.fromTo(words, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.6, ease: 'power4.out' })
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, '-=0.4')
        .to({}, { duration: 0.8 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/v2/brandfilm.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-forest/55" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display leading-[0.95] tracking-[0.02em] text-birch" style={{ fontSize: 'clamp(2.6rem,8vw,7rem)' }}>
          {WORDS.map((w) => (
            <span key={w} className="block overflow-hidden md:inline-block md:px-4">
              <span data-word className="block will-change-transform">
                {w}
              </span>
            </span>
          ))}
        </h2>
        <span data-rule className="mt-6 block h-px w-[min(560px,72vw)] origin-left bg-gold/80" />
        <p className="mt-8 font-ui text-[14px] tracking-[0.02em] text-birch/70">
          Viking Fuel — byggt i Norden, tillverkat i EU.
        </p>
        <Button href="/about" variant="ghost" className="mt-9">
          Vår historia
        </Button>
      </div>
    </section>
  );
}
