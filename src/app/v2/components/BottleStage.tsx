'use client';

import React, { useEffect, useRef } from 'react';
import { sampleBottle } from '../lib/bottleTimeline';
import { getPalm, getStageProgress } from '../lib/stageStore';
import { prefersReducedMotion } from '../lib/motion';

/**
 * The persistent product layer. Mounted once, fixed over everything, never
 * unmounted — the page scrolls behind it while scroll progress animates it.
 * That continuity is the whole effect.
 *
 * One image does the acting: the finished bottle, sealed. It rises out of the
 * ground already closed — no lid drops onto it and nothing is assembled on
 * screen. The product is simply there, whole, the way it arrives at the door.
 */

/** Sprite geometry, measured off the render. */
const BOX_ASPECT = '754 / 1477';

export default function BottleStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bottle = bottleRef.current;
    const shadow = shadowRef.current;
    if (!wrap || !bottle || !shadow) return;

    const reduced = prefersReducedMotion();
    // The rig lerps toward its target instead of tracking scroll exactly — the
    // trailing beat is what gives the bottle weight. Frozen review shots
    // (/?p=…) snap instead, so the pose is exactly the keyframe.
    const frozen = new URLSearchParams(window.location.search).has('p');
    const LERP = reduced || frozen ? 1 : 0.08;
    const cur = { x: 0, y: 120, scale: 0.9, rotY: 0, rotZ: 0, opacity: 0 };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const tick = () => {
      const stageP = getStageProgress();
      let t = sampleBottle(stageP);
      const now = performance.now() / 1000;

      // The landing is aimed at the hand rather than at a coordinate. The keys
      // fly the bottle to roughly the right place; from 0.80 the palm's own
      // measured position takes over, so the base meets the palm on a 1280
      // laptop and on a 2560 monitor alike. Once it has landed the aim never
      // lets go: the palm is measured every frame, so as the stage unpins and
      // the section scrolls away the bottle rides up with the hand rather than
      // leaving it empty.
      const palm = getPalm();
      const aim = Math.max(0, Math.min(1, (stageP - 0.8) / 0.06));
      if (palm && aim > 0) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Size comes off the disc too: at 62% of it the product clears the ring
        // on every screen instead of growing out of it on a tall window.
        const fit = (palm.size * 0.62) / bottle.offsetHeight;
        const scale = t.scale + (fit - t.scale) * aim;
        const half = (bottle.offsetHeight * scale) / 2;
        // 8px of overlap so the base sits in the palm instead of hovering on it
        const xv = ((palm.x - vw / 2) / vw) * 100;
        const yv = ((palm.y + 8 - half - vh / 2) / vh) * 100;
        t = { ...t, x: t.x + (xv - t.x) * aim, y: t.y + (yv - t.y) * aim, scale };
      }

      // Once the aim is fully locked the trailing beat has to go: the product
      // is being held now, not flying, and a lag would let it drift out of the
      // hand while the section scrolls away.
      const held = palm !== null && aim >= 0.999;
      const follow = held ? 1 : LERP;
      cur.x += (t.x - cur.x) * follow;
      cur.y += (t.y - cur.y) * follow;
      cur.scale += (t.scale - cur.scale) * follow;
      cur.rotY += (t.rotY - cur.rotY) * LERP;
      cur.rotZ += (t.rotZ - cur.rotZ) * LERP;
      // If the stage has handed over but there is no hand to hold the product —
      // a remount, a resize mid-scroll — it must not be left floating over
      // whatever section happens to be on screen.
      const orphaned = stageP >= 0.8 && !palm;
      cur.opacity += ((orphaned ? 0 : t.opacity) - cur.opacity) * LERP;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Idle life, running underneath the scroll transform — but only while the
      // product is still travelling. Once the hand has it, every bit of motion
      // stops: no float, no sway, no tilt towards the pointer. It is being held,
      // and a held object is still.
      const alive = 1 - aim;
      const bob = reduced ? 0 : Math.sin(now * (Math.PI * 2) / 4) * 6 * alive;
      const sway = reduced ? 0 : Math.sin(now * 0.5) * 0.5 * alive;
      const px = pointer.x * alive;
      const py = pointer.y * alive;

      // The flat render can't truly yaw, so rotation reads as a slow lean plus a
      // narrowing — enough to feel like a turn without looking like a sprite.
      const yaw = cur.rotY;
      const squash = 1 - Math.abs(Math.sin((yaw * Math.PI) / 180)) * 0.12;

      wrap.style.opacity = String(Math.max(0, Math.min(1, cur.opacity)));
      // The centring translate lives in this transform too — an inline transform
      // replaces Tailwind's, so -translate-x-1/2 can't be left to the class.
      bottle.style.transform =
        `translate3d(calc(-50% + ${cur.x}vw), calc(-50% + ${cur.y}vh + ${bob}px), 0) ` +
        `rotate(${cur.rotZ + sway + px * 1.6}deg) ` +
        `scale(${cur.scale * squash}, ${cur.scale}) ` +
        `perspective(900px) rotateX(${-py * 3}deg) rotateY(${px * 5}deg)`;

      const grounded = Math.max(0, 1 - Math.abs(cur.y) / 40);
      shadow.style.opacity = String(0.32 * grounded * cur.opacity);
      shadow.style.transform =
        `translate3d(calc(-50% + ${cur.x}vw), calc(210px + ${cur.y}vh), 0) scale(${cur.scale})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 hidden opacity-0 md:block"
    >
      {/* Contact shadow — green-tinted, never black */}
      <div
        ref={shadowRef}
        className="absolute left-1/2 top-1/2 h-[26px] w-[300px] -translate-x-1/2 translate-y-[210px] rounded-[50%] bg-forest/40 blur-2xl"
      />

      <div
        ref={bottleRef}
        className="absolute left-1/2 top-1/2 h-[62vh] max-h-[620px] w-auto -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ aspectRatio: BOX_ASPECT }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/v2/bottle-closed.png" alt="" className="h-full w-full" />
      </div>
    </div>
  );
}
