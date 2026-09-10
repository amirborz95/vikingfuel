'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const LINKS = [
  { label: 'Hem', href: '/v2' },
  { label: 'Produkter', href: '/products' },
  { label: 'Om oss', href: '/about' },
  { label: 'Blogg', href: '/knowledge' },
];

/**
 * The /v2 bar: a floating pill rather than a full-width strip — dark glass over
 * the hero footage, birch glass once the page turns light. Hides on scroll-down
 * and comes back on scroll-up.
 *
 * Self-contained on purpose. This page is an experiment; nothing here should be
 * able to change the shop's own header.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 80);
      setHidden(y > 240 && y > last.current);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 px-4 pt-4 transition-all duration-[500ms] ease-[cubic-bezier(.76,0,.24,1)] md:px-6 md:pt-5 ${
          hidden ? '-translate-y-[140%]' : 'translate-y-0'
        }`}
      >
        <div
          className={`mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center rounded-full border px-5 shadow-ambient backdrop-blur-xl transition-all duration-[500ms] md:px-7 ${
            solid ? 'h-[64px] border-mist/90 bg-birch/85' : 'h-[72px] border-birch/25 bg-forest/30'
          }`}
        >
          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`vf-underline font-ui text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  solid ? 'text-forest' : 'text-birch/90'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Meny"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className={`block h-px w-6 transition-colors ${solid ? 'bg-forest' : 'bg-birch'}`} />
            <span className={`block h-px w-6 transition-colors ${solid ? 'bg-forest' : 'bg-birch'}`} />
          </button>

          <Link href="/v2" className="justify-self-center transition-opacity duration-300 hover:opacity-80">
            <Logo tone={solid ? 'forest' : 'birch'} size="sm" />
          </Link>

          <div
            className={`flex items-center justify-end gap-4 transition-colors duration-300 md:gap-5 ${
              solid ? 'text-forest' : 'text-birch'
            }`}
          >
            <Link
              href="/products"
              className={`hidden h-10 items-center rounded-full px-5 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 lg:inline-flex ${
                solid ? 'bg-pine text-birch hover:bg-forest' : 'bg-birch text-pine hover:bg-white'
              }`}
            >
              Köp — 349 kr
            </Link>
            <Link href="/checkout" aria-label="Kundvagn" className="relative transition-opacity hover:opacity-70">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 7h16l-1.4 12H5.4L4 7zM9 7V5.5a3 3 0 0 1 6 0V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full ${solid ? 'bg-pine' : 'bg-gold'}`} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 bg-birch transition-opacity duration-500 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/v2/bottle-full.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-[-10%] h-[70%] opacity-[0.08]"
        />
        <span className="absolute left-6 top-6">
          <Logo size="sm" />
        </span>
        <button
          aria-label="Stäng meny"
          onClick={() => setOpen(false)}
          className="absolute right-6 top-7 font-ui text-[12px] uppercase tracking-[0.18em] text-forest"
        >
          Stäng
        </button>
        <nav className="flex h-full flex-col justify-center gap-4 px-8">
          {LINKS.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-[48px] leading-none text-forest transition-transform duration-500"
              style={{ transitionDelay: `${i * 60}ms`, transform: open ? 'translateY(0)' : 'translateY(24px)' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-pine font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-birch"
          >
            Köp nu — 349 kr
          </Link>
        </nav>
      </div>
    </>
  );
}
