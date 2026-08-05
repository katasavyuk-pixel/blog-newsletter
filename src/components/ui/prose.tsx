import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Long-form reading wrapper for MDX posts.
 *
 * Measure is 70ch, not 65: Spanish runs roughly 15–20% longer than English for
 * the same content, so the English-tuned default reads narrow and breaks lines
 * more often than it should.
 *
 * The explicit colour modifiers are load-bearing. `prose-neutral` supplies
 * Tailwind's cold greys, and only the elements listed here were ever overridden
 * — so rules, tables, captions and list markers rendered cold inside a warm
 * palette. Anything added to an article that is not in this list will do the
 * same, which is why the list is exhaustive rather than minimal.
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
        "prose prose-neutral max-w-[70ch]",
        "prose-headings:font-display prose-headings:tracking-tight prose-headings:text-fg",
        "prose-p:text-fg prose-li:text-fg prose-strong:text-fg",
        "prose-a:text-accent-ink prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-accent prose-blockquote:text-muted",
        "prose-code:text-accent-ink prose-figcaption:text-faint",
        "prose-hr:border-border prose-th:text-fg prose-td:text-muted",
        "marker:text-accent-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
