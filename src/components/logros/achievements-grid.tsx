"use client";

import { allPosts } from "@/lib/posts";
import { useAchievements } from "@/hooks/use-achievements";
import { AchievementCard } from "./achievement-card";

export function AchievementsGrid() {
  const publishedSlugs = allPosts.filter((p) => !p.draft).map((p) => p.slug);
  const { achievements, unlocked, progress } = useAchievements(publishedSlugs);
  const unlockedMap = new Map(unlocked.map((u) => [u.id, u]));

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((def) => (
        <AchievementCard
          key={def.id}
          def={def}
          unlock={unlockedMap.get(def.id)}
          progress={progress[def.id]}
        />
      ))}
    </div>
  );
}
