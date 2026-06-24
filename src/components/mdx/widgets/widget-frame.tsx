"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "rounded-full border border-border bg-bg px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

/**
 * The signature "lab card" frame that wraps every interactive widget so the
 * whole blog reads as one instrument panel. Provides an optional reset button
 * and a "show the math" toggle. `not-prose` so it sits cleanly inside Prose.
 */
export function WidgetFrame({
  title = "interactivo",
  caption,
  math,
  onReset,
  children,
  className,
}: {
  title?: string;
  caption?: ReactNode;
  math?: ReactNode;
  onReset?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const [showMath, setShowMath] = useState(false);

  return (
    <figure
      className={cn(
        "not-prose relative my-8 overflow-hidden rounded-2xl border border-border bg-bg shadow-card",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
      />
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-2.5">
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-wider text-accent-ink">
          <span
            aria-hidden
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
          />
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {math ? (
            <button
              type="button"
              onClick={() => setShowMath((s) => !s)}
              className={controlClass}
              aria-expanded={showMath}
            >
              {showMath ? "ocultar" : "ver"} matemáticas
            </button>
          ) : null}
          {onReset ? (
            <button type="button" onClick={onReset} className={controlClass}>
              reset
            </button>
          ) : null}
        </div>
      </header>

      <div className="p-4 sm:p-5">{children}</div>

      {math && showMath ? (
        <div className="border-t border-border bg-surface px-4 py-3 text-sm text-fg">
          {math}
        </div>
      ) : null}

      {caption ? (
        <figcaption className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
