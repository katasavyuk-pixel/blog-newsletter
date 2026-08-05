"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * `rise` is the workhorse: a short fade and lift.
 *
 * `blur` adds defocus to the same move, so a block resolves instead of sliding
 * in. It costs a compositor blur, so it is for section openings rather than for
 * every card in a grid — the same trick the entry wizard uses to materialise its
 * panel.
 */
const VARIANTS = {
  rise: {
    hidden: { opacity: 0, y: 18 },
    shown: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
} as const;

/** Fade a block into view once. Honors reduced-motion via MotionProvider. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof VARIANTS;
}) {
  const { hidden, shown } = VARIANTS[variant];

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: variant === "blur" ? 0.7 : 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
