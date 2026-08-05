"use client";

import { motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSceneRange } from "./use-scene-range";
import { SCENE_COPY, SIGNAL_ITEMS, type SignalItem } from "@/config/scrolly";
import { MASCOT } from "@/config/intent";
import { Mascot } from "@/components/wizard/mascot";
import { useMounted } from "@/hooks/use-mounted";
import { NOISE_LAYOUT, type NoiseWord } from "./noise-layout";
import { SceneClosing, SceneKicker } from "./scene-chrome";
import { useSceneProgress } from "./use-scene-progress";

/** Chispa is mid-flight over this stretch; the list assembles in her wake. */
const SWEEP_START = 0.04;
const SWEEP_END = 0.46;

/** Leftovers from act one, still hanging around when this scene opens. */
const RESIDUE: NoiseWord[] = NOISE_LAYOUT.slice(0, 8);

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

/** One verified headline sliding into the clean list. */
function SignalRow({
  item,
  index,
  progress,
}: {
  item: SignalItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.2 + index * 0.062;
  const end = start + 0.075;

  const opacity = useSceneRange(progress, [start, end], [0, 1]);
  const x = useSceneRange(progress, [start, end], [-26, 0]);
  const filter = useSceneRange(progress, [start, end], ["blur(7px)", "blur(0px)"]);

  return (
    <motion.li
      style={{ opacity, x, filter }}
      className="flex gap-3 border-b border-dark-border py-2.5 last:border-b-0"
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs text-accent-ink">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm text-on-dark sm:text-base">
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
 * Chispa crosses the frame; the leftover hype goes out behind her and what is
 * left is one real Radar edition, verbatim. The headlines are the seven items of
 * `content/posts/radar-2026-08-04.mdx`, so the claim the scene closes on is
 * checkable against a post rather than decorative.
 */
export function SignalScene() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);
  const mounted = useMounted();

  const chispaX = useSceneRange(progress, [SWEEP_START, SWEEP_END], ["-24vw", "112vw"]);
  const chispaOpacity = useSceneRange(
    progress,
    [SWEEP_START, SWEEP_START + 0.05, SWEEP_END - 0.06, SWEEP_END],
    [0, 1, 1, 0],
  );
  const listOpacity = useSceneRange(progress, [0.72, 0.88], [1, 0]);
  const closing = useSceneRange(progress, [0.74, 0.88, 0.97], [0, 1, 1]);

  return (
    <section ref={ref} aria-hidden className="relative h-[160vh] sm:h-[240vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden bg-dark">
        {mounted
          ? RESIDUE.map((item) => (
              <ResidualNoise key={item.word} item={item} progress={progress} />
            ))
          : null}

        <motion.div
          style={{ x: chispaX, opacity: chispaOpacity }}
          className="pointer-events-none absolute top-[16%] left-0"
        >
          <Mascot name={MASCOT.name} size="lg" />
        </motion.div>

        <motion.ol
          style={{ opacity: listOpacity }}
          className="relative w-full max-w-2xl px-6"
        >
          {SIGNAL_ITEMS.map((item, i) => (
            <SignalRow key={item.title} item={item} index={i} progress={progress} />
          ))}
        </motion.ol>

        <SceneKicker>{SCENE_COPY.senal.kicker}</SceneKicker>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SceneClosing opacity={closing}>{SCENE_COPY.senal.closing}</SceneClosing>
        </div>
      </div>
    </section>
  );
}
