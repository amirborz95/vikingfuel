'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button, Label } from '../ui';
import { setPalm, setStageProgress } from '../../lib/stageStore';
import { ACTS, windowFade } from '../../lib/bottleTimeline';
import { prefersReducedMotion } from '../../lib/motion';
import { INGREDIENTS, BENEFITS } from '../../lib/content';

/**
 * The pinned stage: one 500vh scroll range that carries the whole opening film.
 * The product itself lives in <BottleStage /> (fixed, above this); everything
 * here is the HTML that assembles and dissolves around it.
 */
export default function Stage() {
  const root = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<string, HTMLElement | null>>({});
  const set = (k: string) => (el: HTMLElement | null) => {
    layers.current[k] = el;
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();
    let raf = 0;
    let progress = 0;

    // Review helper: /v2?p=0.35 freezes the film at one moment so a single act
    // can be looked at (and screenshotted) without scrubbing to it.
    const frozen = new URLSearchParams(window.location.search).get('p');
    if (frozen !== null) {
      progress = Math.max(0, Math.min(1, Number(frozen)));
      setStageProgress(progress);
    }

    const st = frozen !== null ? null : ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=400%',
      pin: el.querySelector('[data-pin]') as HTMLElement,
      pinSpacing: true,
      scrub: reduced ? true : 1,
      // This pin adds 400vh to the document, so it has to be measured before
      // the triggers below it — otherwise they compute their start and end
      // against a page that is 400vh shorter than the real one.
      refreshPriority: 10,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress = self.progress;
        setStageProgress(progress);
      },
    });

    const paint = () => {
      const p = progress;
      const L = layers.current;

      const setL = (k: string, o: number, y = 0) => {
        const node = L[k];
        if (!node) return;
        node.style.opacity = String(o);
        node.style.transform = `translate3d(0, ${y}px, 0)`;
        node.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      };

      // ACT 1 — footage + ghost word, no product yet.
      const act1 = windowFade(p, 0, ACTS.assembly[0] + 0.05, 0.05);
      const media = L.media;
      if (media) {
        // The range is in the photograph itself — it holds, then dissolves into
        // the studio just as the single bottle starts to rise out of it.
        const goes = Math.max(0, Math.min(1, (p - 0.08) / 0.14));
        media.style.opacity = String(1 - goes);
        media.style.filter = `blur(${goes * 24}px)`;
        media.style.transform = `scale(${1 + p * 0.12})`;
      }
      setL('cue', act1);

      // ACT 3 — the hold: hero copy fades in around the sealed product.
      const heroK = windowFade(p, 0.66, 0.8, 0.04);
      setL('hero', heroK, (1 - heroK) * 18);

      // ACT 4 — the orbit: badges assemble, product frozen.
      const orbit = windowFade(p, 0.40, 0.60, 0.035);
      const badges = el.querySelectorAll<HTMLElement>('[data-badge]');
      badges.forEach((b, i) => {
        const local = Math.max(0, Math.min(1, (p - (0.39 + i * 0.014)) / 0.05));
        const out = Math.max(0, Math.min(1, (p - 0.60) / 0.05));
        const k = local * (1 - out);
        b.style.opacity = String(k);
        b.style.transform = `translate3d(${(1 - k) * Number(b.dataset.dx) * 20}px, ${(1 - k) * Number(b.dataset.dy) * 20}px, 0) scale(${0.4 + k * 0.6})`;
      });
      setL('orbitTitle', orbit);
      setL('intro', windowFade(p, 0.40, 0.60, 0.035));

      // ACT 5 — the handoff: product flies right, benefits stack in on the left.
      // No fade-out at the end: the hand keeps the bottle and the whole
      // section carries it up out of frame as the stage unpins.
      const hand = windowFade(p, 0.84, 1.02, 0.04);
      setL('hand', hand);
      // Hand the palm's live position to the bottle. Measured, not assumed —
      // the hand sits in a max-width grid while the bottle is placed in
      // viewport units, so on a wide screen a fixed coordinate misses.
      const palmEl = el.querySelector<HTMLElement>('[data-palm]');
      if (palmEl && p > 0.7) {
        const r = palmEl.getBoundingClientRect();
        const disc = palmEl.parentElement!.getBoundingClientRect();
        setPalm({ x: r.left, y: r.top, size: disc.width });
      }
      // Deliberately no `else` that clears it: in development this component
      // mounts twice, and a second paint loop sitting at progress 0 would blank
      // the palm the live one has just published. The bottle ignores it by
      // progress anyway, and unmount clears it.
      const rows = el.querySelectorAll<HTMLElement>('[data-benefit]');
      rows.forEach((r, i) => {
        const k = Math.max(0, Math.min(1, (p - (0.83 + i * 0.018)) / 0.04));
        r.style.opacity = String(k);
        r.style.transform = `translate3d(0, ${(1 - k) * 34}px, 0)`;
      });

      raf = requestAnimationFrame(paint);
    };
    raf = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
      setPalm(null);
    };
  }, []);

  return (
    <div ref={root} className="relative hidden md:block" id="stage">
      <div data-pin className="relative h-[100svh] w-full overflow-hidden bg-birch">
        {/* ACT 1 — macro footage behind everything, dissolving into daylight */}
        <div ref={set('media')} className="absolute inset-0 will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/v2/hero-range.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-forest/25" />
        </div>

        {/* The stage the footage dissolves into: a lit cyclorama, not flat paper —
            floor gradient, beauty-dish key from top-left, and a soft vignette. */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#FDFEFC_0%,#EFF3EE_48%,#D9E4DB_78%,#CFDCD2_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-[34%] bg-[linear-gradient(180deg,rgba(12,42,30,0)_0%,rgba(12,42,30,.07)_100%)]" />
        <div className="absolute left-[22%] top-[26%] -z-10 h-[92vh] w-[92vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.98)_0%,rgba(255,255,255,.45)_42%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(12,42,30,0)_55%,rgba(12,42,30,.10)_100%)]" />

        {/* Ghost word */}
        <div
          ref={set('ghost')}
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <span className="font-display leading-none tracking-[-0.03em]" style={{ fontSize: 'clamp(6rem,18vw,20rem)', color: 'rgba(246,247,243,.5)' }}>
            VIKINGFUEL
          </span>
        </div>

        {/* ACT 3 — hero copy */}
        <div ref={set('hero')} className="absolute inset-0 opacity-0">
          <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-6 md:px-10 lg:px-16">
            <div className="max-w-[26rem]">
              <Label>Nordiskt premiumtillskott</Label>
              <h1 className="mt-6 font-display leading-[0.95] tracking-[-0.02em] text-forest" style={{ fontSize: 'clamp(2.6rem,6vw,5.5rem)' }}>
                Kraft som byggs
                <br />
                varje dag.
              </h1>
              <p className="mt-6 max-w-[22rem] font-ui text-[17px] leading-[1.65] text-stone">
                +Testo-Support — 60 kapslar med naturliga ingredienser för energi, hormonbalans och prestation.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/products">Köp nu — 349 kr</Button>
                <Button href="#formeln" variant="secondary">
                  Läs om formeln
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ACT 4 — ingredient orbit */}
        <div ref={set('orbitTitle')} className="absolute left-0 right-0 top-[8vh] text-center opacity-0">
          <Label>Varje ingrediens har ett skäl att vara med.</Label>
        </div>

        {INGREDIENTS.map((ing, i) => (
          <div
            key={ing.name}
            data-badge
            data-dx={ing.x > 0 ? 1 : -1}
            data-dy={ing.y > 0 ? 1 : -1}
            className="absolute left-1/2 top-1/2 w-[190px] -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{ marginLeft: `${ing.x}vw`, marginTop: `${ing.y}vh` }}
          >
            <div className="flex flex-col items-center text-center">
              <span className="relative flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/70 text-moss shadow-ambient backdrop-blur-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ing.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="relative">
                  <ing.Icon />
                </span>
              </span>
              <span className="mt-3 font-ui text-[15px] font-semibold text-forest">{ing.name}</span>
              <span className="mt-1 font-ui text-[12px] leading-snug text-stone">{ing.note}</span>
            </div>
          </div>
        ))}

        {/* ACT 4 — the copy frames the ring instead of fighting it */}
        <div ref={set('intro')} className="pointer-events-none absolute inset-0 opacity-0" id="formeln">
          <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col items-center justify-between px-6 pb-[5vh] pt-[11vh] text-center md:px-10 lg:px-14">
            <div>
              <Label>Flaggskeppet</Label>
              <h2 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-forest">
                +Testo-Support
              </h2>
            </div>
            {/* the stat row would collide with the lower badges — the ring says
                enough on its own */}
            <span />
          </div>
        </div>

        {/* ACT 5 — the handoff */}
        <div ref={set('hand')} className="absolute inset-0 opacity-0">
          <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-[1.05fr_1fr] items-center gap-12 px-6 md:px-10 lg:px-16">
            <div className="space-y-8">
              {BENEFITS.map((b, i) => (
                <div key={b.title} data-benefit className="relative flex items-start gap-4 opacity-0">
                  <span className="pointer-events-none absolute -left-3 -top-7 font-display text-[86px] leading-none text-mist">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist bg-white text-moss">
                    <b.Icon />
                  </span>
                  <div className="relative">
                    <h3 className="font-ui text-[19px] font-semibold text-forest">{b.title}</h3>
                    <p className="mt-1.5 max-w-[30rem] font-ui text-[15px] leading-[1.65] text-stone">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative flex items-center justify-center">
              {/* The disc is sized so the whole product fits inside it once the
                  bottle is standing in the palm, and nudged right so the ring
                  sits clear of the benefit column. */}
              <div className="relative aspect-square w-[min(40vw,620px)] translate-x-[8%] rounded-full bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#E7EBE5_60%,#DCE3DB_100%)] shadow-ambient">
                {/* The palm sits under the product; the forearm dissolves into
                    the disc on the right so only the fingers break the circle. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/v2/open-hand.png"
                  alt="Öppen hand som håller Viking Fuel"
                  className="absolute left-[0%] top-[39%] w-[90%] max-w-none"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to left, transparent 2%, black 24%)',
                    maskImage: 'linear-gradient(to left, transparent 2%, black 24%)',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* The palm itself. The hand's placement was solved against
                    the ring: at 90% of the disc, every part of the hand stays
                    inside the circle and a bottle 62% of the disc tall still
                    clears it. The ring and the hand then slide right together
                    while this anchor slides left by the same amount — the
                    bottle keeps its place on screen and the hand comes across
                    to meet it, so the base lands mid-palm rather than on the
                    fingers. */}
                <span
                  data-palm
                  className="pointer-events-none absolute left-[48%] top-[67.3%] block h-px w-px"
                />
                {/* contact shadow where the bottle meets the palm */}
                <span className="absolute left-[48%] top-[67.3%] h-[16px] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-forest/30 blur-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div ref={set('cue')} className="absolute bottom-10 left-6 flex items-center gap-3 md:left-10 lg:left-16">
          <span className="relative block h-12 w-px bg-birch/50">
            <span className="vf-cue absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold" />
          </span>
          <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-birch/80">Scrolla</span>
        </div>

        {/* Rotating micro-badge */}
        <div className="absolute bottom-8 right-6 h-[104px] w-[104px] md:right-10 lg:right-16">
          <svg viewBox="0 0 120 120" className="vf-spin h-full w-full">
            <defs>
              <path id="vf-badge" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text className="fill-forest/70 font-ui" style={{ fontSize: 10.5, letterSpacing: '0.22em' }}>
              <textPath href="#vf-badge">TILLVERKAD I EU · UTAN ONÖDIGA TILLSATSER · </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-[20px] text-gold">ᛉ</span>
        </div>
      </div>
    </div>
  );
}
