"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { NoiseScene } from "./noise-scene";
import { SignalScene } from "./signal-scene";
import { PipelineScene } from "./pipeline-scene";

/**
 * Written when the visitor reaches the end of the intro or skips it; read by
 * the `beforeInteractive` script in the root layout, which hides the whole
 * intro on later visits before the first paint. Storage can fail (private
 * mode, quota) and that is fine: the cost of the intro showing again is one
 * skip-link click.
 */
const SEEN_KEY = "kata:intro-vista";

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage unavailable — the intro simply shows again next visit
  }
}

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
  const endRef = useRef<HTMLDivElement>(null);

  // Reaching the end of the track counts as having seen it, however fast the
  // scroll was. This started as an IntersectionObserver, but a 1px sentinel is
  // trivially skippable: one big jump (End key, anchor to the footer) carries
  // it from below the viewport to above it without ever intersecting, and the
  // observer stayed silent. A passive scroll check cannot be jumped over —
  // past the sentinel is past the sentinel. When the intro is hidden
  // (`intro-vista` in CSS) the sentinel has no box and the check passes on
  // mount, which is fine: the flag is already set.
  useEffect(() => {
    const sentinel = endRef.current;
    if (!sentinel) return;
    const check = () => {
      if (sentinel.getBoundingClientRect().top <= window.innerHeight) {
        markSeen();
        window.removeEventListener("scroll", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  if (reduced) return null;

  // The id is the hook the pre-paint script in the root layout styles away on
  // return visits — raw CSS injected into <head>, so React never reconciles it.
  return (
    <div id="scrolly-intro" className="scrolly-intro relative">
      <div aria-hidden>
        <NoiseScene />
        <SignalScene />
        <PipelineScene statusLines={statusLines} />
        <div ref={endRef} className="h-px" />
      </div>

      {/* Sticky rather than fixed, and last in the flow, so it rides along for
          the whole intro and leaves with it — no scroll listener, and no invisible
          hit target left behind once it has faded. The negative margin keeps it
          from adding height of its own. */}
      <div className="pointer-events-none sticky bottom-6 z-[45] -mt-20 flex h-12 items-end px-5">
        <a
          href="#masthead"
          onClick={markSeen}
          className="pointer-events-auto rounded-full border border-dark-border-2 bg-dark-input/80 px-4 py-2 font-mono text-xs text-on-dark-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-on-dark"
        >
          Saltar intro ↓
        </a>
      </div>
    </div>
  );
}
