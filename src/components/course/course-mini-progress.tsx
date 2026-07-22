"use client";

import { useLocalState } from "@/hooks/use-local-state";
import { COURSE_PROGRESS_KEY, COURSE_SLUGS } from "@/config/course";

type Progress = Record<string, boolean>;

/**
 * Compact course progress (bar + count) for the home pillar block. Shares
 * COURSE_PROGRESS_KEY with CourseList/CourseProgressMarker, so progress made
 * on lesson pages shows up here without accounts.
 */
export function CourseMiniProgress() {
  const [progress] = useLocalState<Progress>(COURSE_PROGRESS_KEY, {});
  const done = COURSE_SLUGS.filter((slug) => progress[slug]).length;

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={COURSE_SLUGS.length}
        aria-label="Progreso del curso"
        className="h-2 w-32 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(done / COURSE_SLUGS.length) * 100}%` }}
        />
      </div>
      <span className="font-display text-xs text-muted">
        {done}/{COURSE_SLUGS.length} lecciones
      </span>
    </div>
  );
}
