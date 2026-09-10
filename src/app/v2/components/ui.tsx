'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion';

/* ── Buttons ─────────────────────────────────────────────────────────────── */

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

/** Pill, 56px tall. Primary fills from the bottom on hover; the label lifts 1px. */
export function Button({ href, children, variant = 'primary', className = '' }: ButtonProps) {
  const base =
    'group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full px-8 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300';
  const skins = {
    primary: 'bg-pine text-birch',
    secondary: 'border border-forest/70 text-forest hover:text-birch',
    ghost: 'border border-birch/60 text-birch hover:text-forest',
  } as const;
  const fill = {
    primary: 'bg-forest',
    secondary: 'bg-forest',
    ghost: 'bg-birch',
  } as const;

  return (
    <Link href={href} className={`${base} ${skins[variant]} ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100 ${fill[variant]}`}
      />
      <span className="relative transition-transform duration-300 group-hover:-translate-y-px">{children}</span>
    </Link>
  );
}

/* ── Labels & headings ───────────────────────────────────────────────────── */

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block font-ui text-[12px] font-medium uppercase tracking-[0.18em] text-stone ${className}`}>
      {children}
    </span>
  );
}

/**
 * Headline that masks up line by line on scroll. Pass lines, not a paragraph —
 * the mask is what makes the reveal feel typeset rather than animated.
 */
export function SplitHeading({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
}: {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows = el.querySelectorAll('[data-line]');
    if (prefersReducedMotion()) {
      gsap.set(rows, { yPercent: 0, opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          delay,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag className={className}>
      <span ref={ref} className="block">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span data-line className="block will-change-transform">
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ── Media ───────────────────────────────────────────────────────────────── */

/** Image that wipes up from the bottom while its own content settles from 1.08. */
export function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector('img');
    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: 'inset(0% 0 0 0)' });
      gsap.set(img, { scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'cubic-bezier(.76,0,.24,1)' as any,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        img,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

/* ── Layout helpers ──────────────────────────────────────────────────────── */

export function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // Every section eases in and out of its neighbours instead of cutting.
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id={id} className={`py-[clamp(3.5rem,6vw,6rem)] ${className}`}>
      {children}
    </section>
  );
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-14 ${className}`}>{children}</div>;
}

/** Registers ScrollTrigger for pages that mount sections directly. */
export function useGsapReady() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);
}
