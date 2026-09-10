'use client';

import { useEffect, useState } from 'react';

/**
 * One tiny store for the pinned stage's scroll progress (0–1). The stage writes
 * it; the bottle and every copy layer read it. No zustand needed for a single
 * number, and it keeps the client bundle small.
 */
type Listener = (p: number) => void;

let progress = 0;
const listeners = new Set<Listener>();

export function setStageProgress(p: number) {
  progress = p;
  listeners.forEach((l) => l(p));
  mirror();
}

/** Dev aid: the two numbers the whole film hangs on, readable from the console. */
function mirror() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    (window as unknown as { __vf?: unknown }).__vf = { stage: progress, palm };
  }
}

export function getStageProgress() {
  return progress;
}

/**
 * Where the open palm is, in page pixels, while the handoff is on screen.
 *
 * The bottle is placed in viewport units and the hand inside a max-width
 * layout, so on a wide screen the two drift apart — the product ends up beside
 * the hand instead of in it. The stage measures the palm every frame and the
 * bottle aims at that point instead of at a hard-coded coordinate.
 */
let palm: { x: number; y: number; size: number } | null = null;

export function setPalm(point: { x: number; y: number; size: number } | null) {
  palm = point;
}

export function getPalm() {
  return palm;
}

export function useStageProgress(): number {
  const [p, setP] = useState(progress);
  useEffect(() => {
    listeners.add(setP);
    setP(progress);
    return () => {
      listeners.delete(setP);
    };
  }, []);
  return p;
}
