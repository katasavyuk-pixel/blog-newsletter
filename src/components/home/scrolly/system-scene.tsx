"use client";

import { motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import { SCENE_COPY } from "@/config/scrolly";
import { SceneKicker } from "./scene-chrome";
import { useSceneProgress } from "./use-scene-progress";
import { useSceneRange } from "./use-scene-range";

/** Where the terminal finishes printing and the scene starts handing over. */
const TYPING_START = 0.18;
const TYPING_END = 0.72;

/**
 * One status line, wiped in left to right so it reads as being typed rather than
 * faded in. A clip-path costs nothing per frame and, unlike slicing the string,
 * it survives scrolling backwards without reflowing the box.
 */
function TerminalLine({
  line,
  index,
  total,
  progress,
}: {
  line: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const span = (TYPING_END - TYPING_START) / total;
  const start = TYPING_START + index * span;

  const opacity = useSceneRange(progress, [start, start + span * 0.1], [0, 1]);
  const clipPath = useSceneRange(
    progress,
    [start, start + span * 0.85],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );

  return (
    <motion.p style={{ opacity }} className="mt-1 first:mt-2">
      <span aria-hidden className="text-salmon">
        ▸{" "}
      </span>
      <motion.span style={{ clipPath }} className="inline-block align-top">
        {line}
      </motion.span>
    </motion.p>
  );
}

/**
 * Act three — the system, and the handover.
 *
 * The `kata --status` console from the masthead, printed line by line. Same
 * numbers as the panel further down the page because both call
 * `getJourneyStatusLines()`: the scene cannot drift from the panel it is
 * introducing. Fades out on the last stretch so the masthead is already there
 * when the scene releases.
 */
export function SystemScene({ statusLines }: { statusLines: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);

  const panelOpacity = useSceneRange(progress, [0, 0.08, 0.86, 1], [0, 1, 1, 0]);
  const panelScale = useSceneRange(progress, [0.86, 1], [1, 1.06]);
  const caretOpacity = useSceneRange(progress, [TYPING_END, TYPING_END + 0.04], [0, 1]);

  return (
    <section ref={ref} aria-hidden className="relative h-[130vh] sm:h-[190vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-dark">
        <SceneKicker>{SCENE_COPY.sistema.kicker}</SceneKicker>

        <motion.div
          style={{ opacity: panelOpacity, scale: panelScale }}
          className="w-full max-w-xl px-6"
        >
          <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-on-dark-faint">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            {SCENE_COPY.sistema.liveTag}
          </p>

          <div className="mt-4 rounded-2xl border border-dark-border-2 bg-dark-input/70 p-5 font-mono text-sm leading-relaxed text-on-dark-faint shadow-card">
            <p className="text-on-dark-muted">
              <span className="text-salmon">$</span> kata --status
            </p>
            {statusLines.map((line, i) => (
              <TerminalLine
                key={line}
                line={line}
                index={i}
                total={statusLines.length}
                progress={progress}
              />
            ))}
            {/* The blink lives on an inner span on purpose. A CSS animation on
                `opacity` outranks an inline style, so putting `animate-pulse` on
                the same element let the caret blink away merrily from the top of
                the scene, ignoring the gate that is supposed to hold it back
                until the last line has printed. Nested, the two multiply. */}
            <motion.p style={{ opacity: caretOpacity }} className="text-salmon">
              <span className="inline-block animate-pulse">▍</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
