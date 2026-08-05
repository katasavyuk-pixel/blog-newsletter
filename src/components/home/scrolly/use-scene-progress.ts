"use client";

import { useScroll, type MotionValue } from "motion/react";
import type { RefObject } from "react";

/**
 * Scroll progress of one pinned scene: 0 the moment its sticky viewport locks to
 * the top of the screen, 1 when the scene has been scrolled all the way through
 * and is about to release.
 *
 * The scene's own height decides how long it lasts — a 200vh section pinned to a
 * 100vh viewport spends one screenful of scrolling going from 0 to 1. This is the
 * only place in the codebase that touches the scroll API; everything else reads
 * the MotionValue it returns.
 */
export function useSceneProgress(
  ref: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}
