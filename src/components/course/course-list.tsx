"use client";

import Link from "next/link";
import { useLocalState } from "@/hooks/use-local-state";
import { COURSE_PROGRESS_KEY } from "@/config/course";

export type CourseItem = {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  permalink: string;
};

type Progress = Record<string, boolean>;

/**
 * The course itinerary with per-lesson completion state (localStorage via
 * useLocalState — SSR-safe, synced with the marker on each post page).
 */
export function CourseList({ items }: { items: CourseItem[] }) {
  const [progress] = useLocalState<Progress>(COURSE_PROGRESS_KEY, {});
  const done = items.filter((item) => progress[item.slug]).length;
  const next = items.find((item) => !progress[item.slug]);

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-label="Progreso del curso"
          className="h-2 flex-1 overflow-hidden rounded-full bg-surface"
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(done / items.length) * 100}%` }}
          />
        </div>
        <span className="font-display text-sm text-muted">
          {done}/{items.length} completadas
        </span>
      </div>

      <ol className="mt-8 flex flex-col">
        {items.map((item, i) => {
          const isDone = Boolean(progress[item.slug]);
          const isNext = next?.slug === item.slug;
          return (
            <li key={item.slug}>
              <Link
                href={item.permalink}
                className="group flex gap-5 border-b border-border py-6 transition-opacity hover:opacity-80"
              >
                <span
                  aria-hidden
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm font-semibold ${
                    isDone
                      ? "border-accent bg-accent text-on-accent"
                      : "border-border text-muted"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-display text-xs">
                    <span className="text-faint">
                      Lección {i + 1} · {item.readingTime} min
                    </span>
                    {isNext ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 font-medium uppercase tracking-wider text-on-accent">
                        Siguiente
                      </span>
                    ) : null}
                    {isDone ? (
                      <span className="text-accent-ink">Completada</span>
                    ) : null}
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-medium text-fg group-hover:text-accent-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
