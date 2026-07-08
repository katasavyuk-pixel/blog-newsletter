"use client";

import Link from "next/link";
import { allPosts } from "@/lib/posts";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useAchievements } from "@/hooks/use-achievements";
import { useReadingProgress } from "@/hooks/use-reading-progress";

export function PostProgress({ slug }: { slug: string }) {
  const publishedSlugs = allPosts.filter((p) => !p.draft).map((p) => p.slug);
  const { streak, unlocked, progress } = useAchievements(publishedSlugs);
  const { progress: readPct, isComplete } = useReadingProgress(slug);
  const totalUnlocked = unlocked.length;

  const nextUnlocked = Object.entries(progress).find(
    ([, p]) => p && p.current < p.total,
  );
  const nextDef = nextUnlocked
    ? ACHIEVEMENTS.find((a) => a.id === nextUnlocked[0])
    : null;

  return (
    <div className="not-prose mt-12 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-medium text-fg">
            {streak.current > 0
              ? `${streak.current} días seguidos`
              : "Empieza tu racha"}
          </span>
        </div>
        <Link href="/logros" className="text-sm text-accent-ink hover:underline">
          {totalUnlocked} logros →
        </Link>
      </div>
      {readPct < 80 ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Lectura</span>
            <span>{readPct}%</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${readPct}%` }}
            />
          </div>
        </div>
      ) : isComplete ? (
        <p className="mt-2 text-xs text-emerald-600">✓ Leído</p>
      ) : null}
      {nextDef && (
        <p className="mt-3 text-xs text-muted">
          Próximo logro: {nextDef.icon} {nextDef.title}
        </p>
      )}
    </div>
  );
}
