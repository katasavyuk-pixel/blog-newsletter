# Task 7 — Gamification tracking hook-up

## Files modified

| File | Change |
|---|---|
| `src/components/blog/share-buttons.tsx` | Added `markShared()` import, called on clipboard copy, X click, and LinkedIn click |
| `src/components/newsletter/subscribe-form.tsx` | Added `markSubscribed()` import, called after successful `/api/subscribe` response |

## Verification

`npm run build` — **0 errors**. TypeScript, Turbopack, and static generation all clean.
