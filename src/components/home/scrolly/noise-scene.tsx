"use client";

import { cubicBezier, motion, useTransform, type MotionValue } from "motion/react";
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

/**
 * How far towards the camera every headline travels over the act, in px.
 * Chosen so the nearest word (−200) crosses the lens early and the farthest
 * (−1100) barely makes it before the field implodes.
 */
const Z_TRAVEL = 1250;

/** One hype headline, at its own depth, run over by the camera. */
function NoiseHeadline({
  item,
  progress,
}: {
  item: NoiseWord;
  progress: MotionValue<number>;
}) {
  // The real dolly: every headline rides the same travel with the same ease,
  // so the perspective does the parallax — near words exit early and huge,
  // far ones late and small. Per-element (rather than one `z` on the field)
  // because the fade below needs this word's own distance.
  const z = useSceneRange(progress, [0, 0.86], [item.z, item.z + Z_TRAVEL], RUSH);

  // The wall is there from the first pixel — depth dims the far plane, that
  // is all. No fade-in: an act that opens on an empty black screen is not an
  // opening, it is a loading spinner.
  const base = 0.4 + item.depth * 0.6;
  const spike = item.loud ? 1 : Math.min(1, base + 0.25);
  const beat = 0.24 + (item.left / 100) * 0.3;
  const voice = useSceneRange(
    progress,
    [0, beat, beat + 0.08, beat + 0.34, 1],
    [base, base, spike, base, base],
    SCENE_EASE_IO,
  );

  // A headline that has reached the camera plane would render enormous and
  // inverted; it dies just before, which is also what "blowing past the lens"
  // looks like from inside.
  const passFade = useSceneRange(z, [-260, 140], [1, 0]);
  const opacity = useTransform(() => voice.get() * passFade.get());

  return (
    <motion.span
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        z,
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
 * Two dozen hype headlines nobody can act on, parked in real 3D space, and a
 * camera that starts rolling through them from the first pixel of scroll —
 * the wall is already there when the scene paints, because the complaint that
 * got this rewritten was an opening that stared at an empty black screen.
 * Near the end the whole field implodes into the line that follows. It is the
 * problem statement for the next two scenes.
 *
 * The headlines are only painted after hydration. They are not Kata's claims,
 * and leaving "AGI EN 2027" sitting in the served HTML ahead of the real `h1`
 * hands an AI crawler two dozen sentences to misattribute — on the one site that
 * is arguing about that in public.
 */
export function NoiseScene() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);
  const mounted = useMounted();
  // Only the tilt is gated: its value at progress 0 is 0 either way, so the
  // first paint is identical whichever branch the server took.
  const wide = useMediaQuery("(min-width: 640px)");

  // Implode. The field used to simply fade out, which left the closing line
  // arriving over nothing; sucking the noise into a point gives the line
  // something to arrive *from*.
  const scale = useSceneRange(
    progress,
    [0, 0.8, 0.97],
    [1, 1, 0.4],
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

        {/* preserve-3d: without it each headline's z would flatten onto the
            field's plane and the tunnel would render as the old fake zoom. */}
        <motion.div
          style={{ scale, rotateX, opacity: fieldOpacity, transformStyle: "preserve-3d" }}
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
