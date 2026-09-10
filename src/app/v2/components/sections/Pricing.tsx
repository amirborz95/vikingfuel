'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Label, Section, SplitHeading } from '../ui';
import { PACKAGES } from '../../lib/content';

const kr = (n: number) => `${n.toLocaleString('sv-SE')} kr`;

/** Stock and social proof per pack — the numbers the product cards show. */
const META: Record<string, { badge: string; badgeTone: string; reviews: number; cans: number; perPack: number }> = {
  '1': { badge: 'Premium', badgeTone: 'bg-pine text-birch', reviews: 45, cans: 238, perPack: 1 },
  '3': { badge: 'Mest populär', badgeTone: 'bg-gold text-forest', reviews: 28, cans: 238, perPack: 3 },
  '6': { badge: 'Bästa värde', badgeTone: 'bg-forest text-birch', reviews: 15, cans: 238, perPack: 6 },
};

const Stars = () => (
  <span className="flex gap-0.5 text-gold" aria-hidden>
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="m12 2 2.9 6.3 6.6.8-4.9 4.6 1.3 6.7L12 17l-5.9 3.4 1.3-6.7L2.5 9.1l6.6-.8z" />
      </svg>
    ))}
  </span>
);

export default function Pricing() {
  return (
    <Section className="bg-birch" id="kop">
      <Container>
        <div className="mx-auto max-w-[46rem] text-center">
          <Label>Våra produkter</Label>
          <SplitHeading
            lines={['Premiumtillskott för', 'bättre prestation.']}
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-forest"
          />
          <p className="mx-auto mt-5 max-w-[46ch] font-ui text-[16px] leading-[1.7] text-stone">
            Välj paketet som passar dig. Samma formel i alla tre — det enda som skiljer är hur länge du kör och vad du
            betalar per burk.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p) => {
            const m = META[p.id];
            const discount = p.old > 0 ? Math.round((1 - p.price / p.old) * 100) : 0;
            const stockPct = Math.min(100, Math.max(12, Math.round((m.cans / 400) * 100)));

            return (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-mist bg-white shadow-ambient transition-all duration-500 hover:-translate-y-1.5 hover:shadow-ambient-lift"
              >
                {/* Image panel with the badges */}
                <div className="relative flex h-[300px] items-center justify-center bg-[linear-gradient(180deg,#F7F9F6_0%,#EDF2EC_100%)] p-8">
                  <span
                    className={`absolute left-5 top-5 rounded-full px-3 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.16em] ${m.badgeTone}`}
                  >
                    {m.badge}
                  </span>
                  {discount > 0 && (
                    <span className="absolute right-5 top-5 rounded-full bg-moss px-3 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-birch">
                      −{discount}%
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={`Viking Fuel ${p.name}`}
                    className="max-h-full w-auto object-contain transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-ui text-[19px] font-semibold text-forest">Testo-support{p.id !== '1' ? ` ${p.id}-pack` : ''}</h3>
                  <p className="mt-1 font-ui text-[14px] text-stone">
                    {p.caps}
                    {discount > 0 ? ` · ${discount} % rabatt` : ''}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Stars />
                    <span className="font-ui text-[13px] text-stone">({m.reviews} recensioner)</span>
                  </div>

                  {/* Stock */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between font-ui text-[11px] uppercase tracking-[0.14em] text-stone">
                      <span>{m.cans} burkar kvar</span>
                      <span>
                        {m.perPack} {m.perPack === 1 ? 'burk' : 'burkar'}/paket
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
                      <span className="block h-full rounded-full bg-pine" style={{ width: `${stockPct}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex items-end gap-3">
                    <span className="font-display text-[36px] leading-none text-forest">{kr(p.price)}</span>
                    {p.old > 0 && <span className="pb-1 font-ui text-[15px] text-stone line-through">{kr(p.old)}</span>}
                  </div>
                  <p className="mt-2 font-ui text-[12px] text-stone">6 % moms ingår i priset. {p.per}.</p>

                  <Link
                    href={p.href}
                    className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-pine font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-birch transition-colors duration-300 hover:bg-forest"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7h16l-1.4 12H5.4L4 7zM9 7V5.5a3 3 0 0 1 6 0V7" />
                    </svg>
                    Lägg i kundvagn
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="inline-flex h-14 items-center gap-3 rounded-full border border-forest/70 px-8 font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-forest transition-colors duration-300 hover:bg-forest hover:text-birch"
          >
            Se alla produkter
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-ui text-[12px] uppercase tracking-[0.16em] text-stone">
          <span>Fri frakt över 649 kr</span>
          <span className="text-mist">·</span>
          <span>14 dagars öppet köp</span>
          <span className="text-mist">·</span>
          <span>Säker betalning</span>
          <span className="ml-2 flex items-center gap-4 normal-case tracking-normal text-stone/80">
            {['Klarna', 'Swish', 'Visa', 'Mastercard'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
        </div>
      </Container>
    </Section>
  );
}
