"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { NoiseScene } from "./noise-scene";
import { SignalScene } from "./signal-scene";
import { PipelineScene } from "./pipeline-scene";

/**
 * The three-act intro to the homepage: noise → signal → system, handing over to
 * the masthead.
 *
 * Under `prefers-reduced-motion` it does not render at all. Not dimmed, not
 * frozen — gone, because the calm scrollable page underneath is the better
 * answer for anyone who asked for less movement. Toning it down is not an option
 * either way: `MotionConfig reducedMotion="user"` suppresses transforms but lets
 * opacity animations through, so half the choreography would survive.
 *
 * The scenes are `aria-hidden`: they restate, in pictures, an argument the page
 * makes in words further down. A screen reader lands straight on the masthead.
 * The skip link is deliberately outside that wrapper, because a sighted keyboard
 * user gets no such shortcut and five screens is a long way to the first heading.
 */
export function ScrollyIntro({ statusLines }: { statusLines: string[] }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="relative">
      <div aria-hidden>
        <NoiseScene />
        <SignalScene />
        <PipelineScene statusLines={statusLines} />
      </div>

      {/* Sticky rather than fixed, and last in the flow, so it rides along for
          the whole intro and leaves with it — no scroll listener, and no invisible
          hit target left behind once it has faded. The negative margin keeps it
          from adding height of its own. */}
      <div className="pointer-events-none sticky bottom-6 z-[45] -mt-20 flex h-12 items-end px-5">
        <a
          href="#masthead"
          className="pointer-events-auto rounded-full border border-dark-border-2 bg-dark-input/80 px-4 py-2 font-mono text-xs text-on-dark-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-on-dark"
        >
          Saltar intro ↓
        </a>
      </div>
    </div>
  );
}
