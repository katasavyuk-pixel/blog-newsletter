# Task 6 — Post Progress Widget

## Deliverables

- [x] `src/components/mdx/post-progress.tsx` — created
- [x] `src/app/blog/[slug]/page.tsx` — modified (import + component)

## Changes

### `src/components/mdx/post-progress.tsx` (new)
- Client component rendered at end of each blog post
- Shows current streak (or "Empieza tu racha" if zero)
- Shows total unlocked achievements as a link to `/logros`
- Reading progress bar (0–79% animating, "✓ Leído" at 80%+)
- Next achievable achievement hint, if any

### `src/app/blog/[slug]/page.tsx`
- Added `import { PostProgress } from "@/components/mdx/post-progress"` (after ShareButtons)
- Added `<PostProgress slug={slug} />` inside the main content `div` (after ShareButtons)

## Dependencies used
- `@/lib/posts` (allPosts)
- `@/lib/achievements` (ACHIEVEMENTS)
- `@/hooks/use-achievements` (useAchievements)
- `@/hooks/use-reading-progress` (useReadingProgress)

## Build
```bash
npm run build
# ✓ Compiled successfully
# 0 errors
```
