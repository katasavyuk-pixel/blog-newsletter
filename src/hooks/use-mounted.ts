"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and during the first render, true afterwards.
 *
 * Use it to keep purely decorative markup out of the served HTML. That matters
 * here beyond weight: text in the response body is what an AI crawler reads, and
 * this site is arguing about exactly that (see docs/geo-checklist.md).
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect` because the lint
 * rules of this repo ban setting state straight from an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
