'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Label, Section, SplitHeading } from '../ui';
import { REVIEWS } from '../../lib/content';

const Stars = ({ className = '' }: { className?: string }) => (
  <span className={`flex gap-1 text-gold ${className}`} aria-hidden>
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="m12 2 2.9 6.3 6.6.8-4.9 4.6 1.3 6.7L12 17l-5.9 3.4 1.3-6.7L2.5 9.1l6.6-.8z" />
      </svg>
    ))}
  </span>
);

export default function Reviews() {
  return (
    <Section className="bg-birch" id="recensioner">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div>
            <Label>Omdömen</Label>
            <SplitHeading
              lines={['Vad kunderna', 'säger.']}
              className="mt-5 font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-forest"
            />
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-[88px] leading-none text-forest">4,8</span>
              <span className="pb-3">
                <Stars />
                <span className="mt-2 block font-ui text-[13px] text-stone">Baserat på 16 omdömen</span>
              </span>
            </div>
            <Link href="/reviews" className="vf-underline mt-7 inline-block font-ui text-[14px] font-semibold text-pine">
              Läs alla recensioner →
            </Link>
          </div>

          <div className="flex snap-x gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="w-[19rem] shrink-0 snap-start rounded-[20px] border border-mist bg-birch p-7 shadow-ambient transition-transform duration-500 hover:!rotate-0"
                style={{ transform: `rotate(${r.rot}deg)` }}
              >
                <Stars />
                <blockquote className="mt-5 font-ui text-[15px] leading-[1.65] text-forest">“{r.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist font-ui text-[13px] font-semibold text-pine">
                    {r.name[0]}
                  </span>
                  <span>
                    <span className="block font-ui text-[14px] font-semibold text-forest">{r.name}</span>
                    <span className="block font-ui text-[12px] text-stone">Verifierat köp</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
