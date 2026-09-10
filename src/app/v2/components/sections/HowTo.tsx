'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Container, Label, Section, SplitHeading } from '../ui';
import { STEPS } from '../../lib/content';
import { prefersReducedMotion } from '../../lib/motion';

export default function HowTo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-step]'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Section className="bg-birch">
      <Container>
        <div className="flex flex-col gap-6 border-b border-mist pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[34rem]">
            <Label>Så använder du den</Label>
            <SplitHeading
              lines={['Tre steg. Inget mer.']}
              className="mt-5 font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-forest"
            />
          </div>
          <p className="max-w-[36ch] font-ui text-[16px] leading-[1.7] text-stone">
            En burk räcker en månad. Rutinen är hela poängen — det är därför doserna är satta för två kapslar om dagen,
            inte för en laddningsvecka.
          </p>
        </div>

        <div ref={ref} className="mt-12 grid gap-px overflow-hidden md:grid-cols-3 md:bg-mist">
          {STEPS.map((s) => (
            <div key={s.n} data-step className="relative bg-birch px-0 py-10 md:px-10">
              <span className="pointer-events-none absolute -top-4 left-0 font-display text-[150px] leading-none text-mist md:left-6">
                {s.n}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-mist bg-birch text-pine">
                <s.Icon />
              </span>
              <h3 className="relative mt-6 font-ui text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-snug text-forest">
                {s.title}
              </h3>
              <p className="relative mt-3 max-w-[30ch] font-ui text-[15px] leading-[1.7] text-stone">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
