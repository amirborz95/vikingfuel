'use client';

import React from 'react';
import { Button, Container, Label } from '../ui';
import { BENEFITS, INGREDIENTS } from '../../lib/content';

/**
 * Under 768px there is no pinned stage and no canvas — the same story told as
 * four ordinary stacked screens with the static product render. Premium without
 * asking a phone to run the film.
 */
export default function MobileStage() {
  return (
    <div className="md:hidden">
      {/* Act 1 + 2 + 3 collapsed: the product, the word, the promise */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#EDF2EC_60%,#DCE7DE_100%)] pt-[88px]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 font-display leading-none tracking-[-0.03em] text-forest/[0.12]"
          style={{ fontSize: '19vw' }}
        >
          VIKINGFUEL
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v2/bottle-full.png"
          alt="Viking Fuel +Testo-Support, 60 kapslar"
          className="relative mx-auto h-[42vh] w-auto"
        />
        <Container className="relative pb-16 pt-8 text-center">
          <Label>Nordiskt premiumtillskott</Label>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.98] text-forest">
            Kraft som byggs varje dag.
          </h1>
          <p className="mx-auto mt-5 max-w-[34ch] font-ui text-[16px] leading-[1.65] text-stone">
            +Testo-Support — 60 kapslar med naturliga ingredienser för energi, hormonbalans och prestation.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button href="/products" className="w-full max-w-[20rem]">
              Köp nu — 349 kr
            </Button>
            <Button href="#ingredienser" variant="secondary" className="w-full max-w-[20rem]">
              Läs om formeln
            </Button>
          </div>
        </Container>
      </section>

      {/* Act 4 — ingredients */}
      <section className="bg-birch py-20">
        <Container>
          <Label>Varje ingrediens har ett skäl att vara med</Label>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {INGREDIENTS.map((ing) => (
              <div key={ing.name} className="rounded-[20px] border border-mist bg-birch p-5 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mist/70 text-moss">
                  <ing.Icon />
                </span>
                <p className="mt-3 font-ui text-[14px] font-semibold text-forest">{ing.name}</p>
                <p className="mt-1 font-ui text-[12px] leading-snug text-stone">{ing.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Act 5 — benefits */}
      <section className="bg-mist/50 py-20">
        <Container>
          <Label>Därför tar man den</Label>
          <div className="mt-8 space-y-6">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="relative flex items-start gap-4">
                <span className="pointer-events-none absolute -left-1 -top-5 font-display text-[54px] leading-none text-white/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist bg-birch text-moss">
                  <b.Icon />
                </span>
                <div className="relative">
                  <h3 className="font-ui text-[16px] font-semibold text-forest">{b.title}</h3>
                  <p className="mt-1 font-ui text-[14px] leading-[1.6] text-stone">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
