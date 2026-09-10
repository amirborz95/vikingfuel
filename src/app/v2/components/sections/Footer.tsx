'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '../ui';
import Logo from '../Logo';

const COLUMNS = [
  {
    title: 'Produkter',
    links: [
      { label: 'Testo-support', href: '/testo-support' },
      { label: '3-pack', href: '/testo-support-3-pack' },
      { label: '6-pack', href: '/testo-support-6-pack' },
      { label: 'Prenumeration', href: '/prenumeration' },
    ],
  },
  {
    title: 'Om Viking Fuel',
    links: [
      { label: 'Vår historia', href: '/about' },
      { label: 'Kunskap', href: '/knowledge' },
      { label: 'Recensioner', href: '/reviews' },
      { label: 'Bli affiliate', href: '/affiliate' },
    ],
  },
  {
    title: 'Kundservice',
    links: [
      { label: 'Kontakt', href: '/contact' },
      { label: 'Vanliga frågor', href: '/faq' },
      { label: 'Frakt & leverans', href: '/frakt' },
      { label: 'Returpolicy', href: '/returpolicy' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="bg-forest">
      {/* Newsletter — one clear ask, nothing competing with it */}
      <Container className="border-b border-birch/10 py-[clamp(4rem,7vw,6.5rem)]">
        <div className="mx-auto max-w-[46rem] text-center">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] text-birch">
            Få 10 % på din första order.
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] font-ui text-[15px] leading-[1.7] text-birch/60">
            Nya satser, lanseringar och det vi lär oss på vägen. Ingen spam — avsluta när du vill.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="mx-auto mt-9 flex max-w-[32rem] flex-col items-stretch gap-4 sm:flex-row sm:items-end"
          >
            <label className="flex-1 text-left">
              <span className="sr-only">E-postadress</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.se"
                className="w-full border-b border-birch/35 bg-transparent pb-3 font-ui text-[16px] text-birch placeholder:text-birch/35 focus:border-birch focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-14 shrink-0 rounded-full bg-birch px-8 font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-pine transition-colors hover:bg-white"
            >
              {done ? 'Tack!' : 'Prenumerera'}
            </button>
          </form>
        </div>
      </Container>

      {/* Brand + links */}
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
          <div>
            <Logo tone="birch" size="md" />
            <p className="mt-5 max-w-[36ch] font-ui text-[14px] leading-[1.7] text-birch/55">
              Nordiska kosttillskott utan onödiga tillsatser. Utvecklat i Sverige, tillverkat i EU under GMP och
              tredjepartstestat på varje batch.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/vikingfuel.se/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-birch/20 text-birch/80 transition-colors hover:border-birch/60 hover:text-birch"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="mailto:info@vikingfuel.se"
                className="vf-underline font-ui text-[14px] text-birch/80"
              >
                info@vikingfuel.se
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-birch/40">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="vf-underline font-ui text-[14px] text-birch/85">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <Container className="border-t border-birch/10 py-6">
        <div className="flex flex-col gap-3 font-ui text-[12px] text-birch/40 md:flex-row md:items-center md:justify-between">
          <span>© 2026 SmartVal Sverige AB · Org.nr 559580-6380</span>
          <span className="flex flex-wrap gap-5">
            <Link href="/kopvillkor" className="vf-underline">
              Villkor
            </Link>
            <Link href="/integritetspolicy" className="vf-underline">
              Integritetspolicy
            </Link>
            <Link href="/integritetspolicy" className="vf-underline">
              Cookies
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
