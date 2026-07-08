# Fase C — Gamificación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sistema de gamificación en cliente con rachas, logros, progreso de lectura y badges en home/posts.

**Architecture:** Todo en cliente, localStorage como almacenamiento, hooks React para estado reactivo, sin backend ni dependencias nuevas. Los logros se evalúan al cargar página y tras cada interacción.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, motion, React 19 (server/client components)

## Global Constraints

- **SSR-safe**: hooks deben devolver valores default en servidor, nunca acceder a localStorage en render servidor.
- **Sin dependencias nuevas**: usar solo emojis para iconos, motion para animaciones, use-local-state existente.
- **Estilo Kata Pro**: tarjetas con `rounded-xl border border-border`, colores via design tokens (`--color-accent`, `--color-dark`, etc.).
- **Accesibilidad**: toast de logro con `role="status"`, `prefers-reduced-motion` respetado via `useReducedMotion`.
- **Sin coste API**: 0 llamadas de red, 0 backend.
- **Commits pequeños**: `git add` específico, sin `git add .`.

---

### Task 1: Core domain logic (streak, achievements, state)

**Files:**
- Create: `src/lib/streak.ts`
- Create: `src/lib/achievements.ts`
- Create: `src/lib/achievement-state.ts`

**Interfaces:**
- Produces: `getStreak()`, `recordVisit()`, `STREAK_KEY` constant
- Produces: `ACHIEVEMENTS: AchievementDef[]`, `AchievementId`, `AchievementDef`, `UserState` types
- Produces: `computeUserState()` — builds `UserState` from localStorage keys

- [ ] **Step 1: Create `src/lib/streak.ts`**

```ts
export const STREAK_KEY = "streak:state";
export const STREAK_HISTORY_KEY = "streak:history";

export type StreakState = {
  current: number;
  longest: number;
  lastVisit: string; // "YYYY-MM-DD"
};

export function getStreak(): StreakState {
  if (typeof window === "undefined") return { current: 0, longest: 0, lastVisit: "" };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakState;
  } catch { /* ignore */ }
  return { current: 0, longest: 0, lastVisit: "" };
}

export function recordVisit(): StreakState {
  if (typeof window === "undefined") return { current: 0, longest: 0, lastVisit: "" };
  const today = new Date().toISOString().slice(0, 10);
  const prev = getStreak();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let current = 1;
  if (prev.lastVisit === today) {
    current = prev.current; // misma fecha, no incrementar
  } else if (prev.lastVisit === yesterday) {
    current = prev.current + 1; // día consecutivo
  } else if (prev.lastVisit) {
    current = 1; // racha rota
  }

  const longest = Math.max(current, prev.longest);
  const state: StreakState = { current, longest, lastVisit: today };
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
  return state;
}
```

- [ ] **Step 2: Create `src/lib/achievements.ts`**

```ts
export type AchievementId =
  | "streak_3" | "streak_7" | "streak_14" | "streak_30"
  | "reader_1" | "reader_5" | "reader_all"
  | "explorer_1" | "explorer_5"
  | "challenger"
  | "subscriber"
  | "ambassador";

export type AchievementCategory = "streak" | "reading" | "interactive" | "social";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "streak_3", title: "Principiante", description: "3 días seguidos leyendo", icon: "🔥", category: "streak" },
  { id: "streak_7", title: "Fiel", description: "7 días seguidos", icon: "🔥", category: "streak" },
  { id: "streak_14", title: "Veterano", description: "14 días seguidos", icon: "🔥", category: "streak" },
  { id: "streak_30", title: "Imparable", description: "30 días seguidos", icon: "🔥", category: "streak" },
  { id: "reader_1", title: "Curioso", description: "Leer 1 post", icon: "📖", category: "reading" },
  { id: "reader_5", title: "Aprendiz", description: "Leer 5 posts", icon: "📖", category: "reading" },
  { id: "reader_all", title: "Erudito", description: "Leer todos los posts", icon: "📖", category: "reading" },
  { id: "explorer_1", title: "Explorador", description: "Usar 1 widget interactivo", icon: "🧪", category: "interactive" },
  { id: "explorer_5", title: "Científico", description: "Usar 5 widgets distintos", icon: "🧪", category: "interactive" },
  { id: "challenger", title: "Desafiante", description: "Completar 3 quizzes", icon: "✅", category: "interactive" },
  { id: "subscriber", title: "Suscriptor", description: "Suscribirse a la newsletter", icon: "✉️", category: "social" },
  { id: "ambassador", title: "Embajador", description: "Compartir un post", icon: "🤝", category: "social" },
];

export type UserState = {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  readPostSlugs: string[];
  usedWidgetIds: string[];
  completedQuizIds: string[];
  subscribed: boolean;
  shared: boolean;
  totalPublishedSlugs: string[];
};

export type AchievementUnlock = {
  id: AchievementId;
  unlockedAt: string;
};
```

- [ ] **Step 3: Create `src/lib/achievement-state.ts`**

```ts
import type { UserState, AchievementId, AchievementUnlock } from "./achievements";
import { ACHIEVEMENTS } from "./achievements";
import { getStreak } from "./streak";

const ACHIEVEMENT_PREFIX = "achievement:";
const READ_PREFIX = "read:";
const WIDGET_PREFIX = "widget:";
const QUIZ_PREFIX = "quiz:";
const SUBSCRIBED_KEY = "subscribed";
const SHARED_KEY = "shared";

function getLocalKeys(prefix: string): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) keys.push(key.slice(prefix.length));
  }
  return keys;
}

function getLocalItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

export function computeUserState(totalPublishedSlugs: string[] = []): UserState {
  const streak = getStreak();
  const readSlugs = getLocalKeys(READ_PREFIX);
  const widgetIds = getLocalKeys(WIDGET_PREFIX);
  const quizKeys = getLocalKeys(QUIZ_PREFIX);
  // Quiz is "completed" if it has a value (not null) — user picked an answer
  const completedQuizIds = quizKeys.filter((id) => {
    const val = getLocalItem(`${QUIZ_PREFIX}${id}`);
    return val != null;
  });

  return {
    currentStreak: streak.current,
    longestStreak: streak.longest,
    lastVisitDate: streak.lastVisit,
    readPostSlugs: readSlugs,
    usedWidgetIds: widgetIds,
    completedQuizIds,
    subscribed: getLocalItem(SUBSCRIBED_KEY) === "true",
    shared: getLocalItem(SHARED_KEY) === "true",
    totalPublishedSlugs,
  };
}

export function getUnlockedAchievements(): AchievementUnlock[] {
  const keys = getLocalKeys(ACHIEVEMENT_PREFIX);
  const unlocks: AchievementUnlock[] = [];
  for (const id of keys) {
    const raw = getLocalItem(`${ACHIEVEMENT_PREFIX}${id}`);
    if (raw) {
      try { unlocks.push(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }
  return unlocks;
}

export function evaluateAchievements(state: UserState): AchievementId[] {
  const newlyMet: AchievementId[] = [];

  for (const def of ACHIEVEMENTS) {
    let met = false;
    switch (def.id) {
      case "streak_3": met = state.currentStreak >= 3; break;
      case "streak_7": met = state.currentStreak >= 7; break;
      case "streak_14": met = state.currentStreak >= 14; break;
      case "streak_30": met = state.currentStreak >= 30; break;
      case "reader_1": met = state.readPostSlugs.length >= 1; break;
      case "reader_5": met = state.readPostSlugs.length >= 5; break;
      case "reader_all": met = state.totalPublishedSlugs.length > 0 && state.totalPublishedSlugs.every((s) => state.readPostSlugs.includes(s)); break;
      case "explorer_1": met = state.usedWidgetIds.length >= 1; break;
      case "explorer_5": met = state.usedWidgetIds.length >= 5; break;
      case "challenger": met = state.completedQuizIds.length >= 3; break;
      case "subscriber": met = state.subscribed; break;
      case "ambassador": met = state.shared; break;
    }
    if (met) newlyMet.push(def.id);
  }
  return newlyMet;
}

export function unlockAchievement(id: AchievementId) {
  const payload: AchievementUnlock = { id, unlockedAt: new Date().toISOString() };
  try {
    localStorage.setItem(`${ACHIEVEMENT_PREFIX}${id}`, JSON.stringify(payload));
    window.dispatchEvent(new Event("nbi:local-state"));
  } catch { /* ignore */ }
}

export function markPostRead(slug: string) {
  try {
    localStorage.setItem(`${READ_PREFIX}${slug}`, "true");
    window.dispatchEvent(new Event("nbi:local-state"));
  } catch { /* ignore */ }
}

export function markWidgetUsed(widgetId: string) {
  try {
    localStorage.setItem(`${WIDGET_PREFIX}${widgetId}`, "true");
    window.dispatchEvent(new Event("nbi:local-state"));
  } catch { /* ignore */ }
}

export function markSubscribed() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "true");
    window.dispatchEvent(new Event("nbi:local-state"));
  } catch { /* ignore */ }
}

export function markShared() {
  try {
    localStorage.setItem(SHARED_KEY, "true");
    window.dispatchEvent(new Event("nbi:local-state"));
  } catch { /* ignore */ }
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -20
```
Expected: build succeeds (or type errors in files from later tasks).

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak.ts src/lib/achievements.ts src/lib/achievement-state.ts
git commit -m "feat: core gamification domain logic (streak, achievements, state)"
```

---

### Task 2: Hooks (use-achievements, use-reading-progress)

**Files:**
- Create: `src/hooks/use-achievements.ts`
- Create: `src/hooks/use-reading-progress.ts`

**Interfaces:**
- Consumes: `AchievementId`, `AchievementDef`, `ACHIEVEMENTS`, `UserState`, `computeUserState()`, `evaluateAchievements()`, `getUnlockedAchievements()`, `unlockAchievement()`, `markPostRead()`, `markWidgetUsed()`, `recordVisit()`, `StreakState`, `AchievementUnlock`
- Produces: `useAchievements()` → `{ achievements, unlocked, latest, streak, isNewUnlock, clearNewUnlock }`
- Produces: `useReadingProgress(slug)` → `{ progress, isComplete }`

- [ ] **Step 1: Create `src/hooks/use-reading-progress.ts`**

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
      const pct = Math.min(100, Math.max(0, Math.round((winHeight - top) / total * 100)));
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

- [ ] **Step 2: Create `src/hooks/use-achievements.ts`**

```ts
"use client";

import { useSyncExternalStore, useCallback, useEffect, useState } from "react";
import { ACHIEVEMENTS, type AchievementDef, type AchievementId, type AchievementUnlock, type UserState } from "@/lib/achievements";
import { computeUserState, evaluateAchievements, getUnlockedAchievements, unlockAchievement, recordVisit } from "@/lib/achievement-state";
import { getStreak, type StreakState } from "@/lib/streak";

const STORE_EVENT = "nbi:local-state";

type UseAchievementsReturn = {
  achievements: typeof ACHIEVEMENTS;
  unlocked: AchievementUnlock[];
  latest: AchievementUnlock | null;
  streak: StreakState;
  isNewUnlock: boolean;
  clearNewUnlock: () => void;
  progress: Partial<Record<AchievementId, { current: number; total: number }>>;
};

export function useAchievements(publishedSlugs: string[] = []): UseAchievementsReturn {
  const [latest, setLatest] = useState<AchievementUnlock | null>(null);
  const [isNewUnlock, setIsNewUnlock] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const getSnapshot = useCallback(() => {
    const state = computeUserState(publishedSlugs);
    const already = new Set(getUnlockedAchievements().map((u) => u.id));
    const newlyMet = evaluateAchievements(state);
    const toUnlock = newlyMet.filter((id) => !already.has(id));

    for (const id of toUnlock) {
      unlockAchievement(id);
    }

    const allUnlocks = getUnlockedAchievements();
    const sorted = [...allUnlocks].sort(
      (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );

    return { state, unlocks: allUnlocks, sorted, toUnlock };
  }, [publishedSlugs]);

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener(STORE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(STORE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const data = useSyncExternalStore(subscribe, getSnapshot, () => ({
    state: { currentStreak: 0, longestStreak: 0 } as UserState,
    unlocks: [],
    sorted: [],
    toUnlock: [],
  }));

  useEffect(() => {
    // Record visit on mount
    recordVisit();
  }, []);

  useEffect(() => {
    for (const id of data.toUnlock) {
      if (!seen.has(id)) {
        const unlock = data.unlocks.find((u) => u.id === id);
        if (unlock) {
          setLatest(unlock);
          setIsNewUnlock(true);
          setSeen((prev) => new Set(prev).add(id));
        }
      }
    }
  }, [data.toUnlock, data.unlocks, seen]);

  const clearNewUnlock = useCallback(() => {
    setIsNewUnlock(false);
    setLatest(null);
  }, []);

  const streak = getStreak();

  // Progress info for achievements with partial state
  const progress: UseAchievementsReturn["progress"] = {};
  const readC = data.state.readPostSlugs?.length ?? 0;
  const widgetC = data.state.usedWidgetIds?.length ?? 0;
  const quizC = data.state.completedQuizIds?.length ?? 0;
  progress.reader_1 = { current: Math.min(readC, 1), total: 1 };
  progress.reader_5 = { current: Math.min(readC, 5), total: 5 };
  progress.reader_all = { current: readC, total: publishedSlugs.length || 1 };
  progress.explorer_1 = { current: Math.min(widgetC, 1), total: 1 };
  progress.explorer_5 = { current: Math.min(widgetC, 5), total: 5 };
  progress.challenger = { current: Math.min(quizC, 3), total: 3 };

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

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-achievements.ts src/hooks/use-reading-progress.ts
git commit -m "feat: achievements and reading progress hooks"
```

---

### Task 3: Toast notification for new achievements

**Files:**
- Create: `src/components/home/achievement-toast.tsx`

**Interfaces:**
- Consumes: `AchievementUnlock`, `isNewUnlock`, `clearNewUnlock` from hook
- Produces: `<AchievementToast />` component

- [ ] **Step 1: Create `src/components/home/achievement-toast.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ACHIEVEMENTS, type AchievementUnlock } from "@/lib/achievements";

export function AchievementToast({
  unlock,
  onDismiss,
}: {
  unlock: AchievementUnlock | null;
  onDismiss: () => void;
}) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!unlock) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [unlock, onDismiss]);

  const def = unlock ? ACHIEVEMENTS.find((a) => a.id === unlock.id) : null;
  if (!def) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-bg px-5 py-3 shadow-xl"
        >
          <span className="text-2xl">{def.icon}</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-ink">
              ¡Nuevo logro!
            </p>
            <p className="text-sm font-medium text-fg">{def.title}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/home/achievement-toast.tsx
git commit -m "feat: achievement toast notification"
```

---

### Task 4: Achievements page (/logros)

**Files:**
- Create: `src/components/logros/achievement-card.tsx`
- Create: `src/app/logros/page.tsx`

- [ ] **Step 1: Create `src/components/logros/achievement-card.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { AchievementDef, AchievementUnlock } from "@/lib/achievements";

export function AchievementCard({
  def,
  unlock,
  progress,
}: {
  def: AchievementDef;
  unlock?: AchievementUnlock;
  progress?: { current: number; total: number };
}) {
  const isUnlocked = !!unlock;
  const categoryColors: Record<string, string> = {
    streak: "border-accent/30 bg-accent/5",
    reading: "border-sky-500/30 bg-sky-500/5",
    interactive: "border-amber-500/30 bg-amber-500/5",
    social: "border-emerald-500/30 bg-emerald-500/5",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-5 transition-colors",
        isUnlocked
          ? categoryColors[def.category] ?? "border-accent/30 bg-accent/5"
          : "border-border bg-bg opacity-50",
      )}
    >
      <span className="text-3xl">{def.icon}</span>
      <div>
        <h3
          className={cn(
            "font-semibold",
            isUnlocked ? "text-fg" : "text-muted",
          )}
        >
          {def.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{def.description}</p>
      </div>
      {isUnlocked && unlock ? (
        <p className="mt-auto text-xs text-muted">
          Desbloqueado el{" "}
          {new Date(unlock.unlockedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : null}
      {!isUnlocked && progress ? (
        <div className="mt-auto">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            {progress.current}/{progress.total}
          </p>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/logros/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AchievementsGrid } from "@/components/logros/achievements-grid";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Logros — ${siteConfig.name}`,
  description: "Tu progreso y logros en el blog de IA de Kata Ivanovych. Sigue tu racha de lectura, descubre badges y completa desafíos interactivos.",
};

export default function LogrosPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-fg">
          Logros
        </h1>
        <p className="mt-2 text-lg text-muted">
          Sigue tu progreso mientras lees, aprendes e interactúas.
        </p>
        <AchievementsGrid />
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Create `src/components/logros/achievements-grid.tsx`**

```tsx
"use client";

import { allPosts } from "@/lib/posts";
import { useAchievements } from "@/hooks/use-achievements";
import { AchievementCard } from "./achievement-card";

export function AchievementsGrid() {
  const publishedSlugs = allPosts
    .filter((p) => !p.draft)
    .map((p) => p.slug);
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
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add src/components/logros/ src/app/logros/
git commit -m "feat: achievements page with grid and cards"
```

---

### Task 5: Home integration (badge + toast)

**Files:**
- Create: `src/components/home/achievements-badge.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/home/achievements-badge.tsx`**

```tsx
"use client";

import Link from "next/link";
import { allPosts } from "@/lib/posts";
import { useAchievements } from "@/hooks/use-achievements";
import { AchievementToast } from "./achievement-toast";
import { cn } from "@/lib/utils";

export function AchievementsBadge() {
  const publishedSlugs = allPosts
    .filter((p) => !p.draft)
    .map((p) => p.slug);
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
```

- [ ] **Step 2: Modify `src/app/page.tsx`** — add the badge between Hero and BlogHighlights

```tsx
import { Hero } from "@/components/home/hero";
import { AchievementsBadge } from "@/components/home/achievements-badge";
import { BlogHighlights } from "@/components/home/blog-highlights";
import { InteractiveShowcase } from "@/components/home/interactive-showcase";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { AboutTeaser } from "@/components/home/about-teaser";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto flex max-w-5xl justify-center px-4 pb-8">
        <AchievementsBadge />
      </section>
      <BlogHighlights />
      <InteractiveShowcase />
      <NewsletterCta />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/achievements-badge.tsx src/app/page.tsx
git commit -m "feat: home badge with streak and achievement count"
```

---

### Task 6: Post progress (reading progress in articles)

**Files:**
- Create: `src/components/mdx/post-progress.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create `src/components/mdx/post-progress.tsx`**

```tsx
"use client";

import Link from "next/link";
import { allPosts } from "@/lib/posts";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useAchievements } from "@/hooks/use-achievements";
import { useReadingProgress } from "@/hooks/use-reading-progress";

export function PostProgress({ slug }: { slug: string }) {
  const publishedSlugs = allPosts
    .filter((p) => !p.draft)
    .map((p) => p.slug);
  const { streak, unlocked, progress } = useAchievements(publishedSlugs);
  const { progress: readPct, isComplete } = useReadingProgress(slug);
  const totalUnlocked = unlocked.length;

  // Find next achievable achievement
  const nextUnlocked = Object.entries(progress).find(
    ([_id, p]) => p && p.current < p.total,
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
        <Link
          href="/logros"
          className="text-sm text-accent-ink hover:underline"
        >
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
```

Wait, the `require` won't work well with ESM. Let me fix this — I should import `ACHIEVEMENTS` at the top instead.

- [ ] **Step 2: Modify `src/app/blog/[slug]/page.tsx`** — add PostProgress after ShareButtons.

After line 130 (`<ShareButtons url={fullUrl} title={post.title} />`), add:

```tsx
<PostProgress slug={slug} />
```

And add the import at the top:

```tsx
import { PostProgress } from "@/components/mdx/post-progress";
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/post-progress.tsx src/app/blog/\[slug\]/page.tsx
git commit -m "feat: post progress widget with reading bar and next achievement"
```

---

### Task 7: Social integration (share + subscribe tracking)

**Files:**
- Modify: `src/components/blog/share-buttons.tsx`
- Modify: `src/components/newsletter/subscribe-form.tsx`

- [ ] **Step 1: Modify `src/components/blog/share-buttons.tsx`** — add `markShared()` to copy link and share actions

Add import at top:
```tsx
import { markShared } from "@/lib/achievement-state";
```

Add `markShared()` call inside `copyLink()` after the clipboard write:
```tsx
async function copyLink() {
  try {
    await navigator.clipboard.writeText(url);
    markShared();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  } catch {
    // Clipboard API unavailable — ignore.
  }
}
```

Add `markShared()` to X and LinkedIn share links via `onClick`:
```tsx
<a href={xUrl} target="_blank" rel="noopener noreferrer" onClick={() => markShared()} className={itemClass}>
  X
</a>
<a href={linkedInUrl} target="_blank" rel="noopener noreferrer" onClick={() => markShared()} className={itemClass}>
  LinkedIn
</a>
```

- [ ] **Step 2: Modify `src/components/newsletter/subscribe-form.tsx`** — mark subscribed after successful confirmation

Add import at top:
```tsx
import { markSubscribed } from "@/lib/achievement-state";
```

In the `handleSubmit` function, after `setState(data.preview ? "preview" : "done")`, add:
```tsx
if (data.preview) markSubscribed();
```

And also in the done state section (user sees "confirma tu correo"), we don't know yet if they confirmed. Actually, we should mark subscribed when they *complete* the form (the email was sent), which is when state becomes "done". That's correct — they've taken the action.

Actually wait — the double opt-in means they're not truly subscribed until they click the confirmation link. But for gamification purposes, completing the subscription form is the "action". Let me mark it when state becomes "done" (form submitted successfully):

After `setState("done")`, add `markSubscribed()`.

Let me re-read the code:
```tsx
const data = (await res.json().catch(() => ({}))) as { preview?: boolean };
setState(data.preview ? "preview" : "done");
```

For the "done" path (form submitted):
```tsx
if (!data.preview) markSubscribed();
```

For the "preview" path:
```tsx
if (data.preview) markSubscribed();
```

So in both cases, if the API call succeeds, mark them as subscribed. Let me simplify:

```tsx
if (res.ok) markSubscribed();
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/share-buttons.tsx src/components/newsletter/subscribe-form.tsx
git commit -m "feat: track share and subscribe actions for achievements"
```

---

### Task 8: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run build 2>&1
```
Expected: build succeeds with 0 errors.

- [ ] **Step 2: Lint check**

```bash
npm run lint 2>&1
```
Expected: lint passes with 0 errors.

- [ ] **Step 3: Commit any remaining changes**

```bash
git status
git add <any-unstaged-files>
git commit -m "chore: final adjustments after full build verification"
```
