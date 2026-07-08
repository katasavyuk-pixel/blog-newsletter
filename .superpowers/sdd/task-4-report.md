# Task 4 — Logros (Achievements) Page

## Files created

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/logros/achievement-card.tsx` | Server-compatible card — icon, title, description, unlock date or progress bar |
| 2 | `src/components/logros/achievements-grid.tsx` | Client component — grid layout using `useAchievements` hook |
| 3 | `src/app/logros/page.tsx` | Server page with metadata, heading, and `<AchievementsGrid />` |

## Decisions

- `achievement-card.tsx` is **server-compatible** (no `"use client"`). Purely presentational.
- Category colors map to distinct border/bg tints (accent, sky, amber, emerald) for visual grouping.
- Locked cards with zero progress show neither progress bar nor date — only `opacity-50`.
- `publishedSlugs` is computed from `allPosts` (draft-filtered) inside `AchievementsGrid` to keep the page component clean.
- Metadata follows the same pattern as `sobre-mi/page.tsx` with `siteConfig.name`.
