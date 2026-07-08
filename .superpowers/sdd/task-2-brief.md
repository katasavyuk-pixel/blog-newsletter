# Task 2: Hooks (use-achievements, use-reading-progress)

**Project:** Blog + Newsletter de marca personal (IA) — Next.js 16 App Router, Tailwind v4, TypeScript.

**Context:** React hooks that consume the core gamification logic from Task 1. `use-achievements` is the main hook used by all gamification UI. `use-reading-progress` tracks scroll depth per article.

## Dependencies (already exist)

From `@/lib/achievement-state`:
```ts
computeUserState(totalPublishedSlugs: string[]): UserState
getUnlockedAchievements(): AchievementUnlock[]
evaluateAchievements(state: UserState): AchievementId[]
unlockAchievement(id: AchievementId): void
markPostRead(slug: string): void
```

From `@/lib/achievements`:
```ts
ACHIEVEMENTS: AchievementDef[]
```
Types: `AchievementId`, `AchievementDef`, `AchievementUnlock`, `UserState`

From `@/lib/streak`:
```ts
getStreak(): StreakState
recordVisit(): StreakState
```

## Files to create

### 1. `src/hooks/use-reading-progress.ts`

Tracks scroll progress on `article` element. Marks post as read at 80%.

```ts
"use client";

import { useEffect, useState } from "react";
import { markPostRead } from "@/lib/achievement-state";

export function useReadingProgress(slug: string) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const onScroll = () => {
      const { top, height } = article.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const total = height - winHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.max(0, Math.round(((winHeight - top) / total) * 100)));
      setProgress(pct);
      if (pct >= 80 && !isComplete) {
        setIsComplete(true);
        markPostRead(slug);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, isComplete]);

  return { progress, isComplete };
}
```

### 2. `src/hooks/use-achievements.ts`

Main hook that:
1. Records visit (streak) on mount
2. Computes user state from localStorage
3. Evaluates achievements, unlocks new ones
4. Tracks latest unlock for toast notification
5. Exposes progress data for each achievement
6. Subscribes to `nbi:local-state` and `storage` events for cross-tab sync

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  computeUserState,
  evaluateAchievements,
  getUnlockedAchievements,
  unlockAchievement,
  recordVisit,
} from "@/lib/achievement-state";
import { ACHIEVEMENTS, type AchievementId, type AchievementUnlock } from "@/lib/achievements";
import { getStreak, type StreakState } from "@/lib/streak";

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
  const [latest, setLatest] = useState<AchievementUnlock | null>(null);
  const [isNewUnlock, setIsNewUnlock] = useState(false);
  const seenRef = useRef<Set<AchievementId>>(new Set());

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

  // Track newly unlocked achievements for toast (only once per session)
  useEffect(() => {
    for (const id of data.newlyMet) {
      if (!seenRef.current.has(id)) {
        seenRef.current = new Set(seenRef.current).add(id);
        const unlock = data.unlocks.find((u) => u.id === id);
        if (unlock) {
          setLatest(unlock);
          setIsNewUnlock(true);
        }
      }
    }
  }, [data.newlyMet, data.unlocks]);

  const clearNewUnlock = useCallback(() => {
    setIsNewUnlock(false);
    setLatest(null);
  }, []);

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
```

## Verification

```bash
npm run build
```
Expected: clean build with 0 errors.

## Deliverables

Write these files:
- `src/hooks/use-reading-progress.ts`
- `src/hooks/use-achievements.ts`

Report: `.superpowers/sdd/task-2-report.md`

## Constraints
- "use client" directive required for both hooks
- SSR-safe: `useReadingProgress` uses `useEffect` (client-only), `useAchievements` uses `useState` with default values
- Cross-tab sync via `nbi:local-state` event
- No external dependencies beyond what's imported above
