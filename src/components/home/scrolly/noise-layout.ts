import { NOISE_WORDS } from "@/config/scrolly";

/**
 * mulberry32 — a tiny seeded PRNG.
 *
 * The scattered hype headlines need positions, and `Math.random()` would give
 * the server one layout and the browser another: React would find a different
 * tree on hydration and throw the whole subtree away. Seeded and evaluated once
 * at module load, every render agrees.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type NoiseWord = {
  word: string;
  /** Percent of the viewport box. */
  left: number;
  top: number;
  rotate: number;
  scale: number;
  /** 0 = far, 1 = near. Drives parallax and how loud the word reads. */
  depth: number;
  /**
   * `depth` bucketed into three planes.
   *
   * Depth used to change only how far a word travelled, so every headline was
   * set at the same size and weight and the whole field read as one flat plane
   * of small grey type. The band picks the type scale — and gives the far plane
   * a standing blur, which is what sells depth of field for the price of a
   * class name.
   */
  band: "far" | "mid" | "near";
  /** A few shout in accent ink; the rest are grey chatter. */
  loud: boolean;
  /**
   * Survives on phones. A third of them do — 24 headlines on a 390px screen is
   * an unreadable smear, and the joke only lands if you can read a few. The cut
   * is made with a CSS class rather than a media-query hook so it also survives
   * a resize, and so there is no second source of truth for the breakpoint.
   */
  mobile: boolean;
};

/** Frozen at module load — see the note on `mulberry32`. */
export const NOISE_LAYOUT: NoiseWord[] = (() => {
  const rand = mulberry32(0x5ca1ab1e);
  return NOISE_WORDS.map((word, i) => {
    const depth = rand();
    return {
      word,
      left: 3 + rand() * 87,
      top: 5 + rand() * 86,
      rotate: (rand() - 0.5) * 24,
      // Narrower than it was: the type scale now carries most of the depth, and
      // multiplying the two put the near plane somewhere off the screen.
      scale: 0.85 + depth * 0.35,
      depth,
      band: depth < 0.34 ? "far" : depth < 0.67 ? "mid" : "near",
      loud: rand() > 0.82,
      mobile: i % 3 === 0,
    };
  });
})();
