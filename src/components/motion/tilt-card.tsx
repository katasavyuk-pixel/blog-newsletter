"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";

const SPRING = { stiffness: 260, damping: 26, mass: 0.6 };

/**
 * Pointer-tracked 3D tilt for cards — rotateX/rotateY plus a glare that
 * follows the cursor, all springed so the card settles instead of snapping.
 *
 * Two hard rules baked into the markup:
 *
 * - The caller's `transition-all hover:-translate-y-0.5` pattern cannot live
 *   on the tilted element: a CSS transition would try to animate the inline
 *   `transform` motion writes every frame, and the tilt smears. Border and
 *   shadow transitions are fine; transforms are motion's.
 * - Off entirely under reduced motion and on coarse pointers (a tilt nobody
 *   can steer is just a wobble), so touch and calm users get the plain card.
 *
 * The wrapper exists because `perspective` shapes how children are projected:
 * putting it on the tilting element itself would do nothing.
 */
export function TiltCard({
  children,
  className,
  /** Peak rotation in degrees, each way. */
  max = 4,
  /** Rounding for the glare overlay — match the card's own `rounded-*`. */
  glareClassName = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glareClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const disabled = reduced || coarse;

  // Pointer position inside the card, 0…1. Parked at centre so the card sits
  // flat until first contact and returns there on leave.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(py, (v) => (0.5 - v) * max),
    SPRING,
  );
  const rotateY = useSpring(
    useTransform(px, (v) => (v - 0.5) * max),
    SPRING,
  );
  const glareX = useSpring(useTransform(px, (v) => v * 100), SPRING);
  const glareY = useSpring(useTransform(py, (v) => v * 100), SPRING);
  const glareOpacity = useSpring(hover, SPRING);
  const glare = useMotionTemplate`radial-gradient(340px 260px at ${glareX}% ${glareY}%, color-mix(in srgb, var(--color-coral-soft) 12%, transparent), transparent 70%)`;

  const onPointerMove = (event: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
    hover.set(1);
  };
  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <div className="h-full" style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onPointerMove={disabled ? undefined : onPointerMove}
        onPointerLeave={disabled ? undefined : onPointerLeave}
        style={disabled ? undefined : { rotateX, rotateY }}
        className={cn("relative h-full transform-gpu", className)}
      >
        {children}
        {/* Last in paint order: a 12% sheen over the whole card, text included.
            Under the content an opaque `bg-surface` would swallow it whole. */}
        {disabled ? null : (
          <motion.span
            aria-hidden
            style={{ background: glare, opacity: glareOpacity }}
            className={cn("pointer-events-none absolute inset-0", glareClassName)}
          />
        )}
      </motion.div>
    </div>
  );
}
