"use client";

import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";

/** Same curve as `--ease-out-expo` and as `ScrollReveal`. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Which act you are in, parked in the corner. Deliberately small and monospaced:
 * it labels the scene without competing with it.
 */
export function SceneKicker({ children }: { children: ReactNode }) {
  return (
    <p className="absolute left-6 top-24 font-mono text-xs uppercase tracking-[0.3em] text-accent-ink sm:left-10">
      {children}
    </p>
  );
}

/**
 * The line a scene lands on.
 *
 * Anton in sentence case, which is the house rule: this typeface eats Spanish
 * accents in all-caps. The hype headlines behind it are set in Inter for the
 * same reason — and the split turns a constraint into the point, since the noise
 * ends up wearing the generic font and only Kata's own voice gets the display one.
 */
export function SceneClosing({
  opacity,
  children,
}: {
  opacity: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.p
      style={{ opacity }}
      className="headline relative max-w-3xl px-6 text-center text-3xl text-on-dark sm:text-5xl"
    >
      {children}
    </motion.p>
  );
}
