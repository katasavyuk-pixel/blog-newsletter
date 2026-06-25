import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EyebrowTone = "light" | "dark";

/**
 * Mono, wide-tracked, uppercase category label — the brand's recurring kicker.
 * Terracotta on cream sections, salmon on dark espresso sections.
 */
export function Eyebrow({
  tone = "light",
  className,
  children,
}: {
  tone?: EyebrowTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-display text-xs font-semibold uppercase tracking-[0.2em]",
        tone === "dark" ? "text-salmon" : "text-eyebrow",
        className,
      )}
    >
      {children}
    </p>
  );
}
