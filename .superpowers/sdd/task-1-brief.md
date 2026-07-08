# Task 1: Core domain logic (streak, achievements, state)

**Project:** Blog + Newsletter de marca personal (IA) — Next.js 16 App Router, Tailwind v4, TypeScript.

**Context:** This is the foundation layer for the gamification system. Three pure-logic files with no React dependencies. All run in browser (localStorage) with SSR-safe guards (`typeof window === "undefined"`).

## Files to create

### 1. `src/lib/streak.ts`

Types and logic for daily reading streak tracking. Exports:
- `STREAK_KEY = "streak:state"`
- `STREAK_HISTORY_KEY = "streak:history"`
- `StreakState = { current: number; longest: number; lastVisit: string }`
- `getStreak(): StreakState` — reads from localStorage, returns defaults if not set or on server
- `recordVisit(): StreakState` — records today's visit, calculates streak continuity (same day = no increment, consecutive day = +1, gap = reset to 1)

### 2. `src/lib/achievements.ts`

Pure types and catalog. No localStorage access. Exports:
- `AchievementId` union type with 12 string literals
- `AchievementCategory = "streak" | "reading" | "interactive" | "social"`
- `AchievementDef = { id, title, description, icon, category }`
- `ACHIEVEMENTS: AchievementDef[]` — all 12 achievements defined
- `UserState = { currentStreak, longestStreak, lastVisitDate, readPostSlugs, usedWidgetIds, completedQuizIds, subscribed, shared, totalPublishedSlugs }`
- `AchievementUnlock = { id: AchievementId; unlockedAt: string }`

### 3. `src/lib/achievement-state.ts`

Computation and mutation layer over localStorage. Exports:
- `computeUserState(totalPublishedSlugs: string[]): UserState`
- `getUnlockedAchievements(): AchievementUnlock[]`
- `evaluateAchievements(state: UserState): AchievementId[]`
- `unlockAchievement(id: AchievementId): void`
- `markPostRead(slug: string): void`
- `markWidgetUsed(widgetId: string): void`
- `markSubscribed(): void`
- `markShared(): void`

## Complete code (copy verbatim)

Use the exact code from the plan. All 12 achievements:

| ID | Criteria |
|----|----------|
| streak_3 | currentStreak >= 3 |
| streak_7 | currentStreak >= 7 |
| streak_14 | currentStreak >= 14 |
| streak_30 | currentStreak >= 30 |
| reader_1 | readPostSlugs.length >= 1 |
| reader_5 | readPostSlugs.length >= 5 |
| reader_all | all totalPublishedSlugs in readPostSlugs |
| explorer_1 | usedWidgetIds.length >= 1 |
| explorer_5 | usedWidgetIds.length >= 5 |
| challenger | completedQuizIds.length >= 3 |
| subscriber | subscribed === true |
| ambassador | shared === true |

## Verification

Since there's no test framework, verify via:
```bash
npm run build
```
Expected: clean build with 0 errors (files in `src/lib/` are type-only, no JSX).

## Deliverables

Write these files:
- `src/lib/streak.ts`
- `src/lib/achievements.ts`
- `src/lib/achievement-state.ts`

Report file: `.superpowers/sdd/task-1-report.md`

## Constraints
- SSR-safe: guard all localStorage access with `typeof window === "undefined"`
- No dependencies outside the project
- All localStorage keys use the exact string constants defined above
- Dispatch `new Event("nbi:local-state")` on mutations (for cross-tab sync with existing use-local-state hook)
