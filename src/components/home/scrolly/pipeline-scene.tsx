"use client";

import { motion, type MotionValue } from "motion/react";
import { useRef } from "react";
import {
  PIPELINE_REJECT,
  PIPELINE_STEPS,
  SCENE_COPY,
  SCENE_TRACK,
} from "@/config/scrolly";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  SceneAtmosphere,
  SceneKicker,
  SCENE_EASE,
  SCENE_EASE_IO,
} from "./scene-chrome";
import { useSceneProgress } from "./use-scene-progress";
import { useSceneRange } from "./use-scene-range";

/** When the console below the machine starts and finishes printing. */
const TYPING_START = 0.68;
const TYPING_END = 0.93;

/** When each stage lights, and when the packet is passing through it. */
const STAGE_AT = [0.14, 0.36, 0.58];
const REJECT_AT = 0.42;

type Point = { x: number; y: number };
type Geometry = {
  viewBox: string;
  node: { w: number; h: number };
  /** Top-left of each stage box, in viewBox units. */
  nodes: Point[];
  linkA: string;
  linkB: string;
  reject: string;
  /** Where the packet is at 0, at each stage, and on the way out. */
  packet: Point[];
  /** Where the rejected one goes, and where its cross ends up. */
  rejected: Point[];
  cross: Point;
  /** Anchor for the label that says why it was thrown out. */
  crossLabel: Point;
  labelAnchor: "start" | "middle";
};

/**
 * Two layouts, because a three-stage machine that reads left to right on a
 * laptop is unreadable at 390px and a stack is unreadable at 1440px. Both are
 * plain data so the drawing code below never branches.
 */
const WIDE: Geometry = {
  viewBox: "0 0 880 300",
  // 210 and not 180: "url verbatim, o no hay PR" is the longest detail line and
  // it ran past its own box. Widening the node beats shortening the copy — the
  // second half of that sentence is the gate's teeth.
  node: { w: 210, h: 86 },
  nodes: [
    { x: 20, y: 46 },
    { x: 335, y: 46 },
    { x: 650, y: 46 },
  ],
  linkA: "M 230 89 H 335",
  linkB: "M 545 89 H 650",
  reject: "M 440 132 V 196 Q 440 224 468 224 H 556",
  packet: [
    { x: -20, y: 89 },
    { x: 125, y: 89 },
    { x: 282, y: 89 },
    { x: 440, y: 89 },
    { x: 597, y: 89 },
    { x: 755, y: 89 },
    { x: 900, y: 89 },
  ],
  rejected: [
    { x: 440, y: 89 },
    { x: 440, y: 196 },
    { x: 468, y: 224 },
    { x: 556, y: 224 },
  ],
  cross: { x: 576, y: 224 },
  crossLabel: { x: 596, y: 229 },
  labelAnchor: "start",
};

/**
 * The stack, kept deliberately short. A taller box pushed the console off the
 * bottom of a phone and slid the first stage up under the header, and the
 * rejection label — the line the whole scene exists for — ran off the right
 * edge. Hence 420 units of width for 240 of node: the overflow is where the
 * reject branch lives.
 */
const NARROW: Geometry = {
  viewBox: "0 0 420 500",
  node: { w: 240, h: 76 },
  nodes: [
    { x: 20, y: 10 },
    { x: 20, y: 210 },
    { x: 20, y: 410 },
  ],
  linkA: "M 140 86 V 210",
  linkB: "M 140 286 V 410",
  reject: "M 260 248 H 300 Q 330 248 330 276 V 330",
  packet: [
    { x: 140, y: -20 },
    { x: 140, y: 48 },
    { x: 140, y: 148 },
    { x: 140, y: 248 },
    { x: 140, y: 348 },
    { x: 140, y: 448 },
    { x: 140, y: 540 },
  ],
  rejected: [
    { x: 140, y: 248 },
    { x: 300, y: 248 },
    { x: 330, y: 276 },
    { x: 330, y: 330 },
  ],
  cross: { x: 330, y: 356 },
  crossLabel: { x: 330, y: 384 },
  labelAnchor: "middle",
};

/** A connector, drawn on rather than faded in. */
function Link({
  d,
  progress,
  from,
  to,
}: {
  d: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const pathLength = useSceneRange(progress, [from, to], [0, 1], SCENE_EASE);

  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      className="stroke-dark-border-3"
      style={{ pathLength }}
    />
  );
}

/** One stage of the machine. */
function Stage({
  geo,
  index,
  progress,
}: {
  geo: Geometry;
  index: number;
  progress: MotionValue<number>;
}) {
  const at = STAGE_AT[index];
  const step = PIPELINE_STEPS[index];
  const { x, y } = geo.nodes[index];
  const { w, h } = geo.node;

  const appear = useSceneRange(
    progress,
    [at - 0.12, at - 0.04],
    [0, 1],
    SCENE_EASE,
  );
  // Lights as the packet arrives and stays warm afterwards: a stage that has
  // run is not the same as one that has not.
  const live = useSceneRange(
    progress,
    [at - 0.03, at + 0.04, at + 0.16],
    [0, 1, 0.45],
    SCENE_EASE_IO,
  );

  return (
    <motion.g style={{ opacity: appear }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={18}
        className="fill-dark-input stroke-dark-border-2"
        strokeWidth={1.5}
      />
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={18}
        fill="none"
        strokeWidth={2}
        className="stroke-accent"
        style={{ opacity: live }}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 6}
        textAnchor="middle"
        className="fill-on-dark font-mono text-[19px]"
      >
        {step.label}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 18}
        textAnchor="middle"
        className="fill-on-dark-faint font-mono text-[12px]"
      >
        {step.detail}
      </text>
    </motion.g>
  );
}

/** An item moving through the machine. */
function Packet({
  points,
  progress,
  from,
  to,
  className,
  r = 7,
}: {
  points: Point[];
  progress: MotionValue<number>;
  from: number;
  to: number;
  className: string;
  r?: number;
}) {
  const stops = points.map(
    (_, i) => from + ((to - from) * i) / (points.length - 1),
  );
  const cx = useSceneRange(progress, stops, points.map((p) => p.x), SCENE_EASE_IO);
  const cy = useSceneRange(progress, stops, points.map((p) => p.y), SCENE_EASE_IO);
  const opacity = useSceneRange(
    progress,
    [from, from + 0.02, to - 0.02, to],
    [0, 1, 1, 0],
    SCENE_EASE_IO,
  );

  // `cx`/`cy` as props, not in `style`: motion writes those as SVG attributes,
  // whereas the CSS geometry properties of the same name are not something to
  // lean on across browsers.
  return (
    <motion.circle cx={cx} cy={cy} r={r} className={className} style={{ opacity }} />
  );
}

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
 * The Radar pipeline, drawn: ten feeds in, the gate in the middle, a PR out. One
 * item gets thrown out at the gate with the reason attached, because the
 * rejection is the interesting half — anyone can publish a list, the claim worth
 * making is about what does not survive.
 *
 * This used to be the masthead's `kata --status` console, full size, three
 * hundred pixels above the identical panel that follows it: the visitor watched
 * the same terminal twice. It is still here, but as the machine's output rather
 * than as the act, and it still calls `getJourneyStatusLines()`, so it cannot
 * drift from the panel it is introducing.
 */
export function PipelineScene({ statusLines }: { statusLines: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSceneProgress(ref);
  const wide = useMediaQuery("(min-width: 640px)");
  const geo = wide ? WIDE : NARROW;

  const diagramOpacity = useSceneRange(
    progress,
    [0, 0.06, 0.93, 1],
    [0, 1, 1, 0],
    SCENE_EASE_IO,
  );
  const diagramY = useSceneRange(progress, [0, 0.1], ["18px", "0px"], SCENE_EASE);

  const crossIn = useSceneRange(
    progress,
    [REJECT_AT + 0.08, REJECT_AT + 0.16],
    [0, 1],
    SCENE_EASE,
  );

  const consoleIn = useSceneRange(
    progress,
    [TYPING_START - 0.1, TYPING_START, 0.95, 1],
    [0, 1, 1, 0],
    SCENE_EASE,
  );
  const consoleY = useSceneRange(
    progress,
    [TYPING_START - 0.1, TYPING_START],
    ["20px", "0px"],
    SCENE_EASE,
  );
  const caretOpacity = useSceneRange(
    progress,
    [TYPING_END, TYPING_END + 0.02],
    [0, 1],
  );

  return (
    <section
      ref={ref}
      aria-hidden
      className={`relative ${SCENE_TRACK.sistema}`}
    >
      {/* `section-fade-bottom` hands over to the masthead as a dissolve instead
          of a cut — the intro used to simply stop. */}
      {/* `pt-20` on small screens keeps the stack clear of the kicker parked at
          `top-24`; there is room to spare once the viewport is wide. */}
      <div className="section-fade-bottom sticky top-0 flex h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-dark px-6 pt-20 sm:pt-0">
        <SceneAtmosphere progress={progress} />
        <SceneKicker>{SCENE_COPY.sistema.kicker}</SceneKicker>

        <motion.svg
          viewBox={geo.viewBox}
          style={{ opacity: diagramOpacity, y: diagramY }}
          className="relative w-full max-w-[min(56rem,92vw)] shrink"
          role="presentation"
        >
          <Link d={geo.linkA} progress={progress} from={0.16} to={0.32} />
          <Link d={geo.linkB} progress={progress} from={0.4} to={0.56} />
          <Link
            d={geo.reject}
            progress={progress}
            from={REJECT_AT - 0.04}
            to={REJECT_AT + 0.08}
          />

          {PIPELINE_STEPS.map((step, i) => (
            <Stage key={step.id} geo={geo} index={i} progress={progress} />
          ))}

          {/* Three go in, one comes back out of the gate. */}
          <Packet
            points={geo.packet}
            progress={progress}
            from={0.1}
            to={0.66}
            className="fill-accent-ink"
          />
          <Packet
            points={geo.rejected}
            progress={progress}
            from={REJECT_AT - 0.02}
            to={REJECT_AT + 0.1}
            className="fill-gunmetal"
            r={6}
          />

          <motion.g style={{ opacity: crossIn }}>
            <text
              x={geo.cross.x}
              y={geo.cross.y}
              textAnchor="middle"
              className="fill-accent-ink font-mono text-[22px]"
            >
              ✗
            </text>
            <text
              x={geo.crossLabel.x}
              y={geo.crossLabel.y}
              textAnchor={geo.labelAnchor}
              className="fill-on-dark-faint font-mono text-[13px]"
            >
              {PIPELINE_REJECT}
            </text>
          </motion.g>
        </motion.svg>

        <motion.div
          style={{ opacity: consoleIn, y: consoleY }}
          className="relative w-full max-w-xl"
        >
          <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-on-dark-faint">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            {SCENE_COPY.sistema.liveTag}
          </p>

          <div className="mt-3 rounded-2xl border border-dark-border-2 bg-dark-input/70 p-4 font-mono text-xs leading-relaxed text-on-dark-faint shadow-card sm:text-sm">
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
