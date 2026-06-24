"use client";

import { useLocalState } from "@/hooks/use-local-state";
import { cn } from "@/lib/utils";
import { WidgetFrame } from "./widget-frame";

export type QuizOption = { text: string; correct?: boolean; explain: string };

/**
 * Inline knowledge check. The learning lives in the per-option explanations
 * (especially WHY each wrong answer is wrong) — not in a score. No "fail" state,
 * answered-state persisted in localStorage so re-reads remember.
 */
export function Quiz({
  id,
  question,
  options,
}: {
  id: string;
  question: string;
  options: QuizOption[];
}) {
  const [picked, setPicked] = useLocalState<number | null>(`quiz:${id}`, null);
  const answered = picked != null;

  return (
    <WidgetFrame title="Quiz" onReset={answered ? () => setPicked(null) : undefined}>
      <p className="font-medium text-fg">{question}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                aria-pressed={isPicked}
                onClick={() => setPicked(i)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors",
                  !answered &&
                    "border-border bg-bg hover:border-accent hover:bg-surface",
                  answered && opt.correct && "border-accent bg-surface-2 text-fg",
                  answered &&
                    isPicked &&
                    !opt.correct &&
                    "border-danger bg-surface text-fg",
                  answered &&
                    !isPicked &&
                    !opt.correct &&
                    "border-border bg-bg text-muted",
                )}
              >
                <span>{opt.text}</span>
                {answered ? (
                  <span aria-hidden className="font-mono text-xs">
                    {opt.correct ? "✓" : isPicked ? "✗" : ""}
                  </span>
                ) : null}
              </button>
              {answered ? (
                <p className="mt-1 px-1 text-xs leading-relaxed text-muted">
                  {opt.explain}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </WidgetFrame>
  );
}
