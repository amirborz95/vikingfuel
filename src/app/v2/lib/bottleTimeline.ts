// The whole bottle choreography lives here. Tune the film from this file alone —
// no component needs to change.
//
// progress 0 → 1 spans the pinned stage (≈400vh of scroll).
//   ACT 0  0.00–0.20  the three packs stand on the footage, then spread and go
//   ACT 2  0.13–0.32  the sealed bottle rises out of the ground into the frame
//   ACT 3  0.32–0.42  the hold — product dead centre, hero copy around it
//   ACT 4  0.42–0.68  six ingredient badges assemble around the held product
//   ACT 5  0.68–0.85  the handoff — product flies right, benefits stack left
//   ACT 6  0.85–1.00  release — product drifts up and out, page resumes

export interface BottleKey {
  at: number;
  /** % of viewport width, positive = right */
  x: number;
  /** % of viewport height, positive = down */
  y: number;
  scale: number;
  /** degrees; a fake "yaw" done as a subtle skew/rotation on the flat render */
  rotY: number;
  rotZ: number;
  opacity: number;
}

export const BOTTLE_KEYS: BottleKey[] = [
  // The opening belongs to the three packs; the single bottle is still below
  // the frame while they spread and go.
  { at: 0.0, x: 0, y: 120, scale: 0.9, rotY: 0, rotZ: 0, opacity: 0 },
  { at: 0.13, x: 0, y: 120, scale: 0.9, rotY: 0, rotZ: 0, opacity: 0 },
  // then it rises, finished and sealed — nothing is assembled on screen
  { at: 0.20, x: 0, y: 58, scale: 0.95, rotY: 8, rotZ: 0, opacity: 1 },
  { at: 0.26, x: 0, y: 16, scale: 1.0, rotY: 16, rotZ: 0, opacity: 1 },
  { at: 0.32, x: 0, y: 0, scale: 1.0, rotY: 22, rotZ: 0, opacity: 1 },
  // …while the six ingredients appear around it. It does not move.
  { at: 0.44, x: 0, y: 0, scale: 0.88, rotY: 32, rotZ: 0, opacity: 1 },
  { at: 0.5, x: 0, y: 0, scale: 0.88, rotY: 44, rotZ: 0, opacity: 1 },
  { at: 0.56, x: 0, y: 0, scale: 0.88, rotY: 50, rotZ: 0, opacity: 1 },
  // across to the right on a shallow arc — it lifts as it leaves the ring and
  // comes down again on the other side, no dip and no detour
  { at: 0.63, x: 12, y: -3, scale: 0.92, rotY: 60, rotZ: 0, opacity: 1 },
  { at: 0.7, x: 21, y: 0, scale: 0.97, rotY: 70, rotZ: 0, opacity: 1 },
  { at: 0.78, x: 21, y: 0, scale: 0.97, rotY: 80, rotZ: 0, opacity: 1 },
  // the benefits: standing in the palm inside the circle. x/y are measured off
  // the hand — the base lands at the palm line, the axis on the thumb's crease
  // rotY is frozen from here on: any drift would keep narrowing the render and
  // read as the bottle still turning in a hand that is holding it still
  { at: 0.86, x: 21.7, y: -8, scale: 0.78, rotY: 96, rotZ: 0, opacity: 1 },
  { at: 0.94, x: 21.7, y: -8, scale: 0.78, rotY: 96, rotZ: 0, opacity: 1 },
  // …and it stays there. The aim below keeps it locked to the palm right to
  // the end of the stage, so when the pin releases the hand carries it up out
  // of frame instead of the product dissolving out of an empty hand.
  { at: 1.0, x: 21.7, y: -8, scale: 0.78, rotY: 96, rotZ: 0, opacity: 1 },
];

export interface BottleState {
  x: number;
  y: number;
  scale: number;
  rotY: number;
  rotZ: number;
  opacity: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Channels are deliberately offset from each other: position settles early,
 * rotation runs the full span, scale lands late. Equal timing on all three is
 * what makes cheap sites look cheap.
 */
const easePos = (t: number) => 1 - Math.pow(1 - clamp01(t / 0.6), 3);
const easeRot = (t: number) => t;
const easeScale = (t: number) => {
  const s = clamp01((t - 0.3) / 0.7);
  return 1 - Math.pow(1 - s, 3);
};

export function sampleKeys(keys: BottleKey[], progress: number): BottleState {
  const p = clamp01(progress);
  let a = keys[0];
  let b = keys[keys.length - 1];

  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].at && p <= keys[i + 1].at) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }

  const span = b.at - a.at || 1;
  const t = clamp01((p - a.at) / span);
  const tp = easePos(t);
  const tr = easeRot(t);
  const ts = easeScale(t);
  const mix = (from: number, to: number, k: number) => from + (to - from) * k;

  return {
    x: mix(a.x, b.x, tp),
    y: mix(a.y, b.y, tp),
    scale: mix(a.scale, b.scale, ts),
    rotY: mix(a.rotY, b.rotY, tr),
    rotZ: mix(a.rotZ, b.rotZ, tp),
    opacity: mix(a.opacity, b.opacity, clamp01(t * 2)),
  };
}

export const sampleBottle = (p: number) => sampleKeys(BOTTLE_KEYS, p);

/** Act boundaries, so sections can fade their copy in and out in step. */
export const ACTS = {
  hero: [0.0, 0.12],
  assembly: [0.12, 0.3],
  hold: [0.3, 0.42],
  orbit: [0.42, 0.68],
  handoff: [0.68, 0.85],
  release: [0.85, 1.0],
} as const;

/** 0→1 ramp over a window, with soft edges — used to fade copy layers. */
export function windowFade(p: number, from: number, to: number, edge = 0.03): number {
  if (p <= from - edge || p >= to + edge) return 0;
  if (p < from) return (p - (from - edge)) / edge;
  if (p > to) return 1 - (p - to) / edge;
  return 1;
}
