"use client";

import { useCallback, useEffect, useState } from "react";
import {
  computeUserState,
  evaluateAchievements,
  getUnlockedAchievements,
  unlockAchievement,
} from "@/lib/achievement-state";
import { ACHIEVEMENTS, type AchievementId, type AchievementUnlock } from "@/lib/achievements";
import { getStreak, recordVisit, type StreakState } from "@/lib/streak";

export type UseAchievementsReturn = {
  achievements: typeof ACHIEVEMENTS;
  unlocked: AchievementUnlock[];
  latest: AchievementUnlock | null;
  streak: StreakState;
  isNewUnlock: boolean;
  clearNewUnlock: () => void;
  progress: Partial<Record<AchievementId, { current: number; total: number }>>;
};

const STORE_EVENT = "nbi:local-state";

export function useAchievements(publishedSlugs: string[] = []): UseAchievementsReturn {
  const [dismissedCount, setDismissedCount] = useState(0);

  const recompute = useCallback(() => {
    const state = computeUserState(publishedSlugs);
    const newlyMet = evaluateAchievements(state);

    for (const id of newlyMet) {
      unlockAchievement(id);
    }

    const allUnlocks = getUnlockedAchievements();
    const sorted = [...allUnlocks].sort(
      (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(),
    );

    return { state, unlocks: allUnlocks, sorted, newlyMet };
  }, [publishedSlugs]);

  const [data, setData] = useState(recompute);

  // Subscribe to localStorage events for cross-tab sync
  useEffect(() => {
    const handler = () => setData(recompute());
    window.addEventListener(STORE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [recompute]);

  // Record visit once on mount
  useEffect(() => { recordVisit(); }, []);

  const isNewUnlock = data.unlocks.length > dismissedCount;
  const latest = isNewUnlock ? (data.sorted[0] ?? null) : null;
  const clearNewUnlock = useCallback(
    () => setDismissedCount(data.unlocks.length),
    [data.unlocks.length],
  );

  const streak = getStreak();

  // Progress info for achievements with partial state
  const readC = data.state.readPostSlugs.length;
  const widgetC = data.state.usedWidgetIds.length;
  const quizC = data.state.completedQuizIds.length;
  const progress: UseAchievementsReturn["progress"] = {
    reader_1: { current: Math.min(readC, 1), total: 1 },
    reader_5: { current: Math.min(readC, 5), total: 5 },
    reader_all: { current: readC, total: publishedSlugs.length || 1 },
    explorer_1: { current: Math.min(widgetC, 1), total: 1 },
    explorer_5: { current: Math.min(widgetC, 5), total: 5 },
    challenger: { current: Math.min(quizC, 3), total: 3 },
  };

  return {
    achievements: ACHIEVEMENTS,
    unlocked: data.unlocks,
    latest,
    streak,
    isNewUnlock,
    clearNewUnlock,
    progress,
  };
}
