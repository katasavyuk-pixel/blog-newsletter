"use client";

import { useSyncExternalStore } from "react";
import { INTENT_STORAGE_KEY } from "@/config/intent";

const EVENT = "kata:intent-wizard";

/** sessionStorage-backed "has the visitor seen the wizard?" — via useSyncExternalStore. */
function readSeen(): boolean {
  try {
    // `?wizard=1` forces the wizard (review/dev), even if already seen this session.
    if (new URLSearchParams(window.location.search).has("wizard")) return false;
    return window.sessionStorage.getItem(INTENT_STORAGE_KEY) === "seen";
  } catch {
    // storage unavailable — treat as seen so nothing blocks the site
    return true;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/**
 * SSR-safe visibility flag for the entry wizard. Server and reduced-motion-safe
 * callers read `false` (never a hydration mismatch); after hydration it flips
 * to `true` for a first-time session visitor. `dismissIntent()` marks it seen.
 */
export function useIntentVisible(): boolean {
  const seen = useSyncExternalStore(subscribe, readSeen, () => true);
  return !seen;
}

/** Mark the wizard as dismissed for this session and notify subscribers. */
export function dismissIntent(): void {
  try {
    window.sessionStorage.setItem(INTENT_STORAGE_KEY, "seen");
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVENT));
}