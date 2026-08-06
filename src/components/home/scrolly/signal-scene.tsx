"use client";

import { motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSceneRange } from "./use-scene-range";
import {
  SCENE_COPY,
  SCENE_TRACK,
  SIGNAL_ITEMS,
  type SignalItem,
} from "@/config/scrolly";
import { MASCOT } from "@/config/intent";
import { Mascot } from "@/components/wizard/mascot";
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

/** Pass one: Chispa crosses the frame and the leftover hype goes out behind her. */
const SWEEP_START = 0.04;
const SWEEP_END = 0.38;

/**
 * Pass two: she comes back down the side of the list, and each headline lights
 * as she reaches it.
 *
 * This is the whole point of the scene and it used not to happen. The rows ran
 * on a timer of their own (`0.2 + i * 0.062`) while she flew somewhere else, so
 * the act claimed a filter was being applied and showed two unrelated things
 * moving. Now her position is what gates them: `ROW_STEP` and her descent share
 * this window by construction, and the alignment below is derived from it.
 */
const DESCENT_START = 0.46;
const DESCENT_END = 0.76;
const ROW_STEP = 0.038;
const ROW_SPAN = 0.055;
/** When the last row starts, and therefore when she reaches the bottom. */
const LAST_ROW = DESCENT_START + (SIGNAL_ITEMS.length - 1) * ROW_STEP;

/** Where she is, over the whole scene. The trail reuses these, lagging. */
const PATH_X_IN = [SWEEP_START, SWEEP_END, SWEEP_END + 0.04, 1];
const PATH_X_OUT = ["-24vw", "112vw", "6vw", "6vw"];
/** An undulation, so pass one is a flight and not a rail. */
const PATH_Y_IN = [SWEEP_START, 0.14, 0.26, SWEEP_END];
const PATH_Y_OUT = ["18vh", "10vh", "23vh", "15vh"];
const PATH_ON_IN = [SWEEP_START, SWEEP_START + 0.05, SWEEP_END - 0.05, SWEEP_END];
const PATH_ON_OUT = [0, 1, 1, 0];

/** Leftovers from act one, still hanging around when this scene opens. */
const RESIDUE: NoiseWord[] = NOISE_LAYOUT.slice(0, 8);

/** Shift a progress range later, which is all "lagging behind her" means. */
function lagged(input: number[], by: number): number[] {
  return input.map((v) => v + by);
}

/**
 * A word Chispa puts out. Each one dies at its own point of her sweep, so the
 * screen clears left to right rather than all at once.
 */
function ResidualNoise({
  item,
  progress,
}: {
  item: NoiseWord;
  progress: MotionValue<number>;
}) {
  // She travels left to right, so a word goes out when she reaches its column.
  const swept = SWEEP_START + (item.left / 100) * (SWEEP_END - SWEEP_START);
  const opacity = useSceneRange(
    progress,
    [0, swept - 0.03, swept + 0.02],
    [0.34, 0.34, 0],
    SCENE_EASE_IO,
  );

  return (
    <motion.span
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        opacity,
        rotate: item.rotate,
        scale: item.scale,
      }}
      className={`absolute origin-center whitespace-nowrap font-display text-sm font-semibold uppercase tracking-tight text-on-dark-faint sm:text-base ${
        item.mobile ? "" : "hidden sm:block"
      }`}
    >
      {item.word}
    </motion.span>
  );
}

/** One ember of her wake — the same path, reached a little later. */
function TrailEmber({
  progress,
  lag,
  size,
}: {
  progress: MotionValue<number>;
  lag: number;
  size: number;
}) {
  const x = useSceneRange(progress, lagged(PATH_X_IN, lag), PATH_X_OUT, SCENE_EASE_IO);
  const y = useSceneRange(progress, lagged(PATH_Y_IN, lag), PATH_Y_OUT, SCENE_EASE_IO);
  const opacity = useSceneRange(
    progress,
    lagged(PATH_ON_IN, lag),
    PATH_ON_OUT.map((v) => v * (0.58 - lag * 4)),
    SCENE_EASE_IO,
  );

  return (
    <motion.div
      style={{ x, y, opacity }}
      className="pointer-events-none absolute left-0 top-0 flex h-32 w-32 items-center justify-center"
    >
      <span
        className="rounded-full bg-accent-ink"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}

/** One verified headline sliding into the clean list, when she reaches it. */
function SignalRow({
  item,
  index,
  progress,
}: {
  item: SignalItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = DESCENT_START + index * ROW_STEP;
  const end = start + ROW_SPAN;

  const opacity = useSceneRange(progress, [start, end], [0, 1], SCENE_EASE);
  const x = useSceneRange(progress, [start, end], [-26, 0], SCENE_EASE);
  const filter = useSceneRange(
    progress,
    [start, end],
    ["blur(6px)", "blur(0px)"],
    SCENE_EASE,
  );
  // The rule that draws itself under the row is what makes it read as *written*
  // rather than revealed.
  const rule = useSceneRange(progress, [start, end], [0, 1], SCENE_EASE);

  return (
    <motion.li
      style={{ opacity, x, filter }}
      className="relative flex gap-3 py-2.5"
    >
      <motion.span
        aria-hidden
        style={{ scaleX: rule }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-dark-border"
      />
      <span className="mt-0.5 shrink-0 font-mono text-xs text-accent-ink">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        {/* Two lines rather than `truncate`: these are real headlines from a
            real edition, and a column of clipped sentences read as a broken
            table instead of as the thing that survived the filter. */}
        <span className="block text-sm leading-snug text-on-dark sm:text-base">
          {item.title}
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-on-dark-faint">
          {item.source} · {item.date}
        </span>
      </span>
    </motion.li>
  );
}

/**
 * Act two — the signal.
 *
 * Chispa crosses the frame and the leftover hype goes out behind her; then she
 * comes back down the edge of the list and writes it, one headline per row, as
 * she passes. The headlines are the seven items of
 * `content/posts/radar-2026-08-04.mdx` verbatim, so the claim the scene closes
 * on is checkable against a post rather than decorative.
 */
export function SignalScene() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);
  const mounted = useMounted();

  const chispaX = useSceneRange(progress, PATH_X_IN, PATH_X_OUT, SCENE_EASE_IO);
  const chispaY = useSceneRange(progress, PATH_Y_IN, PATH_Y_OUT, SCENE_EASE_IO);
  const chispaOpacity = useSceneRange(
    progress,
    PATH_ON_IN,
    PATH_ON_OUT,
    SCENE_EASE_IO,
  );
  // She banks into the turn rather than sliding flat.
  const chispaRotate = useSceneRange(
    progress,
    [SWEEP_START, 0.2, SWEEP_END],
    [10, -4, -10],
    SCENE_EASE_IO,
  );

  /**
   * The scan head of pass two. Its range is derived from `ROW_STEP`, not tuned
   * by eye: row `i` sits at `(i + 0.5) / 7` of the list, so starting at 7% and
   * ending at 93% on the window where the first and last rows fire puts her on
   * each headline exactly as it lights.
   */
  const scanTop = useSceneRange(
    progress,
    [DESCENT_START, LAST_ROW, DESCENT_END],
    ["7%", "93%", "106%"],
    SCENE_EASE_IO,
  );
  const scanOpacity = useSceneRange(
    progress,
    [DESCENT_START - 0.04, DESCENT_START, LAST_ROW + 0.02, DESCENT_END],
    [0, 1, 1, 0],
    SCENE_EASE_IO,
  );

  const listOpacity = useSceneRange(progress, [0.8, 0.93], [1, 0], SCENE_EASE_IO);
  const closing = useSceneRange(progress, [0.8, 0.92, 0.98], [0, 1, 1], SCENE_EASE);
  const closingY = useSceneRange(progress, [0.8, 0.94], ["26px", "0px"], SCENE_EASE);

  return (
    <section ref={ref} aria-hidden className={`relative ${SCENE_TRACK.senal}`}>
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden bg-dark">
        <SceneAtmosphere progress={progress} />

        {mounted
          ? RESIDUE.map((item) => (
              <ResidualNoise key={item.word} item={item} progress={progress} />
            ))
          : null}

        {/* The beam rides in her own 128px box, so it stays centred on her
            without a second transform fighting the one motion writes. */}
        <motion.div
          style={{ x: chispaX, opacity: chispaOpacity }}
          className="pointer-events-none absolute inset-y-0 left-0 w-32"
        >
          <span className="absolute left-1/2 top-0 h-full w-[34vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        </motion.div>

        {/* A lag is a fraction of scene progress, and pass one covers 136vw in
            0.34 of it — so 0.012 puts an ember ~5vw behind her and 0.062 puts
            one ~25vw back. Tighter than this and the wake collapsed into the
            glow around her and read as nothing at all. */}
        {[0.012, 0.024, 0.036, 0.048, 0.062].map((lag, i) => (
          <TrailEmber key={lag} progress={progress} lag={lag} size={12 - i * 1.6} />
        ))}

        <motion.div
          style={{ x: chispaX, y: chispaY, opacity: chispaOpacity, rotate: chispaRotate }}
          className="pointer-events-none absolute left-0 top-0"
        >
          <Mascot name={MASCOT.name} size="lg" />
        </motion.div>

        <motion.div
          style={{ opacity: listOpacity }}
          className="relative w-full max-w-2xl px-6"
        >
          {/* `top` rather than a transform: the head has to land on rows whose
              height the layout owns, and an absolutely positioned element moving
              inside its container reflows nothing but itself.
              `lg` and not `sm`: the list is 672px wide, so a 64px gutter to its
              left only exists once the viewport clears ~800px. Below that she
              would descend off-screen. */}
          <motion.div
            style={{ top: scanTop, opacity: scanOpacity }}
            className="pointer-events-none absolute -left-16 -mt-8 hidden h-16 w-16 items-center justify-center lg:flex"
          >
            <Mascot name={MASCOT.name} />
          </motion.div>

          <ol>
            {SIGNAL_ITEMS.map((item, i) => (
              <SignalRow
                key={item.title}
                item={item}
                index={i}
                progress={progress}
              />
            ))}
          </ol>
        </motion.div>

        <SceneKicker>{SCENE_COPY.senal.kicker}</SceneKicker>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SceneClosing opacity={closing} y={closingY}>
            {SCENE_COPY.senal.closing}
          </SceneClosing>
        </div>
      </div>
    </section>
  );
}
