'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Container, Label, Section, SplitHeading } from '../ui';
import { FAQ } from '../../lib/content';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    bodies.current.forEach((el, j) => {
      if (!el) return;
      gsap.to(el, {
        height: j === next ? 'auto' : 0,
        opacity: j === next ? 1 : 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  };

  return (
    <Section className="bg-birch" id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Label>Vanliga frågor</Label>
            <SplitHeading
              lines={['Det ni frågar', 'mest om.']}
              className="mt-5 font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-forest"
            />
            <p className="mt-6 max-w-[30ch] font-ui text-[16px] leading-[1.7] text-stone">
              Hittar du inte svaret? Mejla{' '}
              <a href="mailto:info@vikingfuel.se" className="vf-underline text-pine">
                info@vikingfuel.se
              </a>{' '}
              — vi svarar samma dag.
            </p>
          </div>

          <div className="lg:pt-2">
            {FAQ.map((item, i) => (
              <div key={item.q} className="border-t border-mist last:border-b">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-ui text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium text-forest">{item.q}</span>
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                    <span className="absolute h-px w-4 bg-forest" />
                    <span
                      className={`absolute h-4 w-px bg-forest transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${
                        open === i ? 'rotate-90' : ''
                      }`}
                    />
                  </span>
                </button>
                <div
                  ref={(el) => {
                    bodies.current[i] = el;
                  }}
                  style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[60ch] pb-7 font-ui text-[16px] leading-[1.7] text-stone">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
