// Shared easing and duration language for the whole build. Movement here is
// heavy and slow — weight, not energy-drink bounce.

export const EASE = {
  reveal: 'cubic-bezier(.76,0,.24,1)',
  hero: 'power4.out',
  hover: 'power2.out',
  settle: 'power3.out',
} as const;

export const DUR = {
  micro: 0.2,
  standard: 0.6,
  reveal: 0.9,
  hero: 1.2,
} as const;

/** Framer variants for the simple enter/exits GSAP doesn't own. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: DUR.reveal, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
