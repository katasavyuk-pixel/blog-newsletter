import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "blue" | "neutral";

const tones: Record<BadgeTone, string> = {
  green: "border border-dark-border-2 bg-surface-2 text-chrome", // level → chrome
  blue: "border border-dark-border-2 bg-surface-2 text-accent-ink", // format → red
  neutral: "border border-dark-border-2 bg-surface-2 text-muted",
};

/** Small mono pill used for level / format labels on cards. */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 font-display text-xs font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
