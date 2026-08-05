"use client";

import { motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSceneRange } from "./use-scene-range";
import { SCENE_COPY } from "@/config/scrolly";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { NOISE_LAYOUT, type NoiseWord } from "./noise-layout";
import { SceneClosing, SceneKicker } from "./scene-chrome";
import { useSceneProgress } from "./use-scene-progress";

/** One hype headline, drifting at its own depth as the camera pushes in. */
function NoiseHeadline({
  item,
  progress,
}: {
  item: NoiseWord;
  progress: MotionValue<number>;
}) {
  // Near words travel further than far ones, which is what sells the depth.
  const y = useSceneRange(progress, [0, 1], [0, -60 - item.depth * 220]);
  const opacity = useSceneRange(
    progress,
    [0, 0.12, 0.62, 0.88],
    [0, 0.35 + item.depth * 0.5, 0.35 + item.depth * 0.5, 0],
  );

  return (
    <motion.span
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        y,
        opacity,
        rotate: item.rotate,
        scale: item.scale,
      }}
      className={`absolute origin-center whitespace-nowrap font-display text-sm font-semibold uppercase tracking-tight sm:text-base ${
        item.loud ? "text-accent-ink" : "text-on-dark-faint"
      } ${item.mobile ? "" : "hidden sm:block"}`}
    >
      {item.word}
    </motion.span>
  );
}

/**
 * Act one — the noise.
 *
 * Two dozen hype headlines nobody can act on, and a camera pushing straight into
 * them until they blow past the edges of the frame. It is the problem statement
 * for the next two scenes.
 *
 * The headlines are only painted after hydration. They are not Kata's claims,
 * and leaving "AGI EN 2027" sitting in the served HTML ahead of the real `h1`
 * hands an AI crawler two dozen sentences to misattribute — on the one site that
 * is arguing about that in public. Starting on black and letting them fade up is
 * also the better opening beat, so the constraint costs nothing.
 */
export function NoiseScene() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);
  const mounted = useMounted();
  // Only the tilt is gated: its value at progress 0 is 0 either way, so the
  // first paint is identical whichever branch the server took.
  const wide = useMediaQuery("(min-width: 640px)");

  const scale = useSceneRange(progress, [0, 1], [0.82, 1.75]);
  const rotateX = useSceneRange(progress, [0, 1], [0, wide ? 14 : 0]);
  const fieldOpacity = useSceneRange(progress, [0.78, 0.95], [1, 0]);
  const closing = useSceneRange(progress, [0.66, 0.82, 0.97], [0, 1, 1]);

  return (
    <section ref={ref} aria-hidden className="relative h-[130vh] sm:h-[200vh]">
      {/* Perspective belongs on the parent: it shapes how children are projected,
          so putting it on the rotating element itself would do nothing. */}
      <div
        style={{ perspective: 1200 }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-dark"
      >
        <motion.div
          style={{ scale, rotateX, opacity: fieldOpacity }}
          className="absolute inset-0"
        >
          {mounted
            ? NOISE_LAYOUT.map((item) => (
                <NoiseHeadline key={item.word} item={item} progress={progress} />
              ))
            : null}
        </motion.div>

        <SceneKicker>{SCENE_COPY.ruido.kicker}</SceneKicker>
        <SceneClosing opacity={closing}>{SCENE_COPY.ruido.closing}</SceneClosing>
      </div>
    </section>
  );
}
