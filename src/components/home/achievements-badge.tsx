"use client";

import Link from "next/link";
import { allPosts } from "@/lib/posts";
import { useAchievements } from "@/hooks/use-achievements";
import { AchievementToast } from "./achievement-toast";
import { cn } from "@/lib/utils";

export function AchievementsBadge() {
  const publishedSlugs = allPosts.filter((p) => !p.draft).map((p) => p.slug);
  const { streak, unlocked, latest, isNewUnlock, clearNewUnlock } =
    useAchievements(publishedSlugs);

  const total = unlocked.length;

  return (
    <>
      <AchievementToast unlock={isNewUnlock ? latest : null} onDismiss={clearNewUnlock} />
      <Link
        href="/logros"
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm transition-colors hover:bg-surface-2",
          total === 0 && "opacity-60",
        )}
      >
        <span className="text-lg">
          {streak.current > 0 ? "🔥" : "📊"}
        </span>
        <span className="font-medium text-fg">
          {streak.current > 0
            ? `${streak.current} días`
            : "Empezar racha"}
        </span>
        {total > 0 ? (
          <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-ink">
            {total} logros
          </span>
        ) : null}
      </Link>
    </>
  );
}
