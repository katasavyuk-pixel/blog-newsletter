"use client";

import { cubicBezier, motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { useSceneRange } from "./use-scene-range";

/**
 * The two curves these scenes are allowed to use.
 *
 * `SCENE_EASE` is the house curve — the same `--ease-out-expo` as `ScrollReveal`
 * and the entry wizard — for anything that arrives and settles. `SCENE_EASE_IO`
 * is for values that are travelling through, where a hard stop at either end
 * would read as a glitch.
 *
 * They are functions rather than bezier tuples so an array of them types as
 * `EasingFunction[]` when a range wants one curve per segment.
 */
export const SCENE_EASE = cubicBezier(0.16, 1, 0.3, 1);
export const SCENE_EASE_IO = cubicBezier(0.4, 0, 0.2, 1);

/**
 * The light in the room.
 *
 * Two red discs, well out of frame, breathing with the scene's progress. The
 * scenes used to sit on flat `bg-dark` with nothing between the background and
 * the type, which is most of what made them feel like slides rather than shots.
 * Same `.glow-layer` primitive the masthead already ships, same tokens.
 *
 * Two blurred layers per scene is the ceiling, and they are siblings on purpose:
 * a `filter` on an ancestor re-blurs the whole rasterised subtree underneath it,
 * which is exactly the mistake that made Chispa's entrance look dirty.
 */
export function SceneAtmosphere({ progress }: { progress: MotionValue<number> }) {
  const opacity = useSceneRange(
    progress,
    [0, 0.22, 0.82, 1],
    [0, 1, 1, 0.12],
    SCENE_EASE_IO,
  );
  const rise = useSceneRange(progress, [0, 1], ["10%", "-14%"], SCENE_EASE_IO);
  const fall = useSceneRange(progress, [0, 1], ["-8%", "12%"], SCENE_EASE_IO);
  const spread = useSceneRange(progress, [0, 1], [0.8, 1.3], SCENE_EASE_IO);

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.span
        style={{ y: rise, scale: spread }}
        className="glow-layer -right-[12%] -top-[18%] h-[64vmin] w-[64vmin] bg-accent/20"
      />
      <motion.span
        style={{ y: fall }}
        className="glow-layer -bottom-[22%] -left-[14%] h-[56vmin] w-[56vmin] bg-red-deep/40"
      />
    </motion.div>
  );
}

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
  y,
  children,
}: {
  opacity: MotionValue<number>;
  /** Optional rise, so the line arrives instead of just appearing. */
  y?: MotionValue<string>;
  children: ReactNode;
}) {
  return (
    <motion.p
      style={{ opacity, y }}
      className="headline relative max-w-3xl px-6 text-center text-3xl text-on-dark sm:text-5xl"
    >
      {children}
    </motion.p>
  );
}
