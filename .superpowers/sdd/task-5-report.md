# Task 5 — Home Page Achievements Badge

**Status:** ✅ Done

## Deliverables

- **Created** `src/components/home/achievements-badge.tsx`
  - Client component rendering streak/achievement count badge with toast integration
  - Links to `/logros`
  - Dims badge at 0 achievements

- **Modified** `src/app/page.tsx`
  - Added import and `<AchievementsBadge />` between `<Hero />` and `<BlogHighlights />`
  - Wrapped in centered `<section>` for layout

## Verification

```
npm run build  →  0 errors, clean build
```
