"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * "Commit a guess, then reveal" wrapper — the pretesting/generation effect.
 * Gating the answer behind an active prediction is the highest-retention
 * mechanic in the research. Keep the surrounding prose carrying the argument.
 */
export function GuessReveal({
  prompt,
  revealLabel = "Revelar respuesta",
  children,
}: {
  prompt?: ReactNode;
  revealLabel?: string;
  children: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-surface p-4">
      {prompt ? <div className="text-sm text-fg">{prompt}</div> : null}
      {revealed ? (
        <div className="mt-3 text-sm text-fg" aria-live="polite">
          {children}
        </div>
      ) : (
        <div className="mt-3">
          <Button size="sm" onClick={() => setRevealed(true)}>
            {revealLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
