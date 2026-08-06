"use client";

import { cubicBezier, motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSceneRange } from "./use-scene-range";
import { SCENE_COPY, SCENE_TRACK } from "@/config/scrolly";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { NOISE_LAYOUT, type NoiseWord } from "./noise-layout";
import {
  SceneAtmosphere,
  SceneClosing,
  SceneKicker,
  SCENE_EASE,
  SCENE_EASE_IO,
} from "./scene-chrome";
import { useSceneProgress } from "./use-scene-progress";

/** Things blowing past the lens accelerate. Linear made them drift like snow. */
const RUSH = cubicBezier(0.45, 0, 0.9, 0.4);

/** Type by plane. The far one carries a standing blur — depth of field for the
 *  price of a class name, and only eight elements ever wear it. */
const BAND_CLASS = {
  far: "text-xs blur-[2px] sm:text-sm",
  mid: "text-sm sm:text-lg",
  near: "text-xl font-black tracking-tighter sm:text-4xl",
} as const;

/** One hype headline, drifting at its own depth as the camera pushes in. */
function NoiseHeadline({
  item,
  progress,
}: {
  item: NoiseWord;
  progress: MotionValue<number>;
}) {
  // Near words travel further than far ones, which is what sells the depth.
  const y = useSceneRange(progress, [0, 1], [0, -60 - item.depth * 220], RUSH);
  // And they leave sideways, away from the middle. A push-in only reads as three
  // dimensions if what is closest to you exits the frame rather than the top.
  const x = useSceneRange(
    progress,
    [0, 1],
    ["0vw", `${((item.left - 50) * item.depth * 0.42).toFixed(2)}vw`],
    RUSH,
  );

  const peak = 0.35 + item.depth * 0.5;
  // A few of them shout on the way past, each at its own moment.
  const spike = item.loud
    ? Math.min(1, peak * 1.7)
    : peak;
  const beat = 0.24 + (item.left / 100) * 0.3;

  const opacity = useSceneRange(
    progress,
    [0, 0.12, beat, beat + 0.08, 0.66, 0.88],
    [0, peak, peak, spike, peak, 0],
    SCENE_EASE_IO,
  );

  return (
    <motion.span
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        x,
        y,
        opacity,
        rotate: item.rotate,
        scale: item.scale,
      }}
      className={`absolute origin-center whitespace-nowrap font-display font-semibold uppercase tracking-tight ${
        BAND_CLASS[item.band]
      } ${item.loud ? "text-accent-ink" : "text-on-dark-faint"} ${
        item.mobile ? "" : "hidden sm:block"
      }`}
    >
      {item.word}
    </motion.span>
  );
}

/**
 * Act one — the noise.
 *
 * Two dozen hype headlines nobody can act on, on three planes, and a camera
 * pushing straight into them until they blow past the edges of the frame — and
 * then collapse inwards, all of it, into the line that follows. It is the
 * problem statement for the next two scenes.
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

  // Push in, then implode. The field used to simply fade out, which left the
  // closing line arriving over nothing; sucking the noise into a point gives the
  // line something to arrive *from*.
  const scale = useSceneRange(
    progress,
    [0, 0.78, 0.97],
    [0.82, 1.72, 0.4],
    [SCENE_EASE_IO, RUSH],
  );
  const rotateX = useSceneRange(progress, [0, 1], [0, wide ? 14 : 0], SCENE_EASE_IO);
  const fieldOpacity = useSceneRange(progress, [0.74, 0.94], [1, 0], SCENE_EASE_IO);

  const closing = useSceneRange(progress, [0.7, 0.86, 0.97], [0, 1, 1], SCENE_EASE);
  const closingY = useSceneRange(progress, [0.7, 0.88], ["26px", "0px"], SCENE_EASE);

  return (
    <section ref={ref} aria-hidden className={`relative ${SCENE_TRACK.ruido}`}>
      {/* Perspective belongs on the parent: it shapes how children are projected,
          so putting it on the rotating element itself would do nothing. */}
      <div
        style={{ perspective: 1200 }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-dark"
      >
        <SceneAtmosphere progress={progress} />

        <motion.div
          style={{ scale, rotateX, opacity: fieldOpacity }}
          className="absolute inset-0"
        >
          {mounted
            ? NOISE_LAYOUT.map((item) => (
                <NoiseHeadline
                  key={item.word}
                  item={item}
                  progress={progress}
                />
              ))
            : null}
        </motion.div>

        <SceneKicker>{SCENE_COPY.ruido.kicker}</SceneKicker>
        <SceneClosing opacity={closing} y={closingY}>
          {SCENE_COPY.ruido.closing}
        </SceneClosing>
      </div>
    </section>
  );
}
