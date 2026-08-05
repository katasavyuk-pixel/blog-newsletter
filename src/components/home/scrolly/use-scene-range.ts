"use client";

import { transform, useTransform, type MotionValue } from "motion/react";

/**
 * Map scene progress onto a range — the array form of `useTransform`, but on the
 * main thread on purpose.
 *
 * Motion compiles `useTransform(progress, [a, b], [x, y])` into a native
 * scroll-driven WAAPI animation when the property is acceleratable (opacity,
 * transform, filter). That optimisation is normally free, and here it is wrong:
 * the timeline it builds is a `ViewTimeline` anchored to the animated element,
 * and every element in these scenes lives inside a `position: sticky` viewport.
 * A pinned element barely moves through the viewport, so its ViewTimeline barely
 * advances — measured, the whole intro sat at ~20% progress while the page was
 * scrolled to 50% and then went backwards. `useScroll`'s `offset` never reached
 * the compiled animation at all.
 *
 * Passing a function instead of two arrays leaves nothing for motion to compile
 * into keyframes, so the value is computed per frame from the progress value we
 * actually asked for. `transform` is motion's own interpolator, so numbers,
 * units and complex strings like `blur(7px)` behave exactly as before.
 */
export function useSceneRange<T>(
  progress: MotionValue<number>,
  input: number[],
  output: T[],
): MotionValue<T> {
  return useTransform(progress, (v) => transform(v, input, output));
}
