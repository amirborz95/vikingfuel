'use client';

import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/**
 * 1.4s birch screen: wordmark strokes in, a gold hairline grows under it, a
 * counter runs to 100, then the whole overlay wipes upward. Once per session.
 */
export default function Preloader() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem('vf_loaded');
    if (seen || prefersReducedMotion()) return;
    setActive(true);
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem('vf_loaded', '1');
        const el = overlay.current;
        if (el) {
          el.style.transition = 'transform .9s cubic-bezier(.76,0,.24,1)';
          el.style.transform = 'translateY(-100%)';
        }
        window.setTimeout(() => {
          document.body.style.overflow = '';
          setActive(false);
        }, 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  if (!active) return null;

  return (
    <div ref={overlay} className="fixed inset-0 z-[70] flex items-center justify-center bg-birch">
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/viking_logo_nav.png"
          alt=""
          aria-hidden
          className="mb-6 h-14 w-14 object-contain opacity-0"
          style={{ animation: 'vf-mark .8s cubic-bezier(.76,0,.24,1) .1s forwards' }}
        />
        <svg viewBox="0 0 520 60" className="h-[42px] w-[360px]" aria-label="Viking Fuel">
          <text
            x="50%"
            y="44"
            textAnchor="middle"
            className="font-display"
            style={{
              fontSize: 44,
              letterSpacing: '0.32em',
              fill: 'transparent',
              stroke: '#0C2A1E',
              strokeWidth: 0.7,
              strokeDasharray: 900,
              strokeDashoffset: 900,
              animation: 'vf-draw 1.2s cubic-bezier(.76,0,.24,1) forwards',
            }}
          >
            VIKING FUEL
          </text>
        </svg>
        <span
          className="mt-3 block h-px bg-gold"
          style={{ width: 0, animation: 'vf-line 1.2s cubic-bezier(.76,0,.24,1) .15s forwards' }}
        />
      </div>
      <span className="absolute bottom-8 right-8 font-ui text-[12px] uppercase tracking-[0.18em] text-stone">
        {String(count).padStart(3, '0')}
      </span>

      <style>{`
        @keyframes vf-draw { to { stroke-dashoffset: 0; fill: #0C2A1E; } }
        @keyframes vf-line { to { width: 120px; } }
        @keyframes vf-mark { from { opacity: 0; transform: translateY(10px) scale(.94); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
