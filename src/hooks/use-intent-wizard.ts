"use client";

import { useSyncExternalStore } from "react";

const EVENT = "kata:intent-wizard";

/**
 * Is the entry wizard open right now?
 *
 * It used to be "has this session seen it?", backed by `sessionStorage`, and it
 * opened itself on arrival. Two problems with that, and the second is the one
 * that settled it:
 *
 * 1. It is a modal over an opaque backdrop, so nothing else on the site exists
 *    until it is dismissed — and it asked for twenty seconds and four clicks
 *    before the visitor had read a line of Kata's. That is the same
 *    landing-page reflex that got the capture form pulled off the masthead and
 *    the email step left out of this very wizard.
 * 2. `sessionStorage` is cleared when the tab closes, so "once per session" was
 *    in practice *once per visit*. The reader who comes back every Monday for
 *    the Radar paid the 4.6s flight and the four steps every single time. That
 *    is not a welcome, it is a recurring toll.
 *
 * So it is opt-in now: `?wizard=1`, or Chispa offering it from her dock. Nothing
 * about the wizard itself changed — routing people is still its job, it just no
 * longer stands in the doorway. `StartHere` and the nav already route, in page,
 * without blocking, and after the `h1`.
 *
 * No persistence: the only ways in are deliberate, so there is nothing to
 * remember and nothing to nag about. Decision by Kata, 2026-08-06.
 */
let open: boolean | null = null;
let openCount = 0;

function isOpen(): boolean {
  if (open === null) {
    try {
      open = new URLSearchParams(window.location.search).has("wizard");
    } catch {
      open = false;
    }
  }
  return open;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** SSR-safe: `false` on the server, so there is never a hydration mismatch. */
export function useIntentVisible(): boolean {
  return useSyncExternalStore(subscribe, isOpen, () => false);
}

/**
 * How many times it has been opened — used as a React `key`, so every opening
 * gets a fresh mount.
 *
 * Without it the wizard is a long-lived component in the layout and keeps its
 * last state: open it from the dock a second time and you land back on "Tu
 * rumbo" with the choice you already made. Remounting also replays the flight,
 * which is the right call — a stale confirmation screen is worse than a
 * four-second entrance you can skip after one.
 */
export function useIntentOpenCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => openCount,
    () => 0,
  );
}

/** Open the wizard on purpose — Chispa's dock, or anything else that asks. */
export function openIntent(): void {
  open = true;
  openCount += 1;
  window.dispatchEvent(new Event(EVENT));
}

/** Close it. Sticks for the rest of the page, `?wizard=1` in the URL included. */
export function dismissIntent(): void {
  open = false;
  window.dispatchEvent(new Event(EVENT));
}
