import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "blue" | "neutral";

const tones: Record<BadgeTone, string> = {
  green: "bg-cat-pale-green text-cat-forest",
  blue: "bg-cat-pale-blue text-cat-navy",
  neutral: "bg-surface-2 text-muted",
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
        "inline-flex items-center rounded-md px-2 py-1 font-mono text-xs tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
