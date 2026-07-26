import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Dark espresso <section> lit by two pulsing coral/amber radial glows — the
 * signature mood of the design. Glow is pure CSS (no JS), so this stays a
 * server component; `prefers-reduced-motion` freezes the pulse (globals.css).
 */
export function GlowSection({
  id,
  fadeBottom = false,
  className,
  children,
}: {
  id?: string;
  fadeBottom?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden bg-dark text-on-dark",
        fadeBottom && "section-fade-bottom",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="glow-layer glow-pulse"
          style={{
            top: "-12%",
            right: "-6%",
            width: "min(64vw, 42rem)",
            height: "min(52vw, 34rem)",
            background: "radial-gradient(circle, var(--color-glow-coral), transparent 70%)",
          }}
        />
        <div
          className="glow-layer glow-pulse"
          style={{
            bottom: "-18%",
            left: "-12%",
            width: "min(56vw, 38rem)",
            height: "min(56vw, 38rem)",
            background: "radial-gradient(circle, var(--color-glow-amber), transparent 72%)",
            animationDelay: "-3.5s",
          }}
        />
      </div>
      {children}
    </section>
  );
}
