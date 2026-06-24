import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Long-form reading wrapper (used by MDX posts in Fase 1).
 * Constrains the measure to ~65ch and themes typography with brand tokens.
 */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-[65ch]",
        "prose-headings:font-display prose-headings:tracking-tight prose-headings:text-fg",
        "prose-p:text-fg prose-li:text-fg prose-strong:text-fg",
        "prose-a:text-accent-ink prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-accent prose-code:text-accent-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
