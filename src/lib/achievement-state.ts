import { type AchievementId, type AchievementUnlock, type UserState } from "./achievements";
import { getStreak } from "./streak";

const UNLOCKED_KEY = "achievements:unlocked";
const READ_POSTS_KEY = "achievements:readPosts";
const USED_WIDGETS_KEY = "achievements:usedWidgets";
const COMPLETED_QUIZZES_KEY = "achievements:completedQuizzes";
const SUBSCRIBED_KEY = "achievements:subscribed";
const SHARED_KEY = "achievements:shared";

function readArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeArray(key: string, val: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

function readBoolean(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

function writeBoolean(key: string, val: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, val ? "true" : "false");
}

function emit(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nbi:local-state"));
  }
}

export function computeUserState(totalPublishedSlugs: string[]): UserState {
  const streak = getStreak();
  return {
    currentStreak: streak.current,
    longestStreak: streak.longest,
    lastVisitDate: streak.lastVisit,
    readPostSlugs: readArray(READ_POSTS_KEY),
    usedWidgetIds: readArray(USED_WIDGETS_KEY),
    completedQuizIds: readArray(COMPLETED_QUIZZES_KEY),
    subscribed: readBoolean(SUBSCRIBED_KEY),
    shared: readBoolean(SHARED_KEY),
    totalPublishedSlugs,
  };
}

export function getUnlockedAchievements(): AchievementUnlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getUnlockedSet(): Set<AchievementId> {
  return new Set(getUnlockedAchievements().map((u) => u.id));
}

export function evaluateAchievements(state: UserState): AchievementId[] {
  const unlocked = getUnlockedSet();
  const newly: AchievementId[] = [];

  if (state.currentStreak >= 3 && !unlocked.has("streak_3")) newly.push("streak_3");
  if (state.currentStreak >= 7 && !unlocked.has("streak_7")) newly.push("streak_7");
  if (state.currentStreak >= 14 && !unlocked.has("streak_14")) newly.push("streak_14");
  if (state.currentStreak >= 30 && !unlocked.has("streak_30")) newly.push("streak_30");
  if (state.readPostSlugs.length >= 1 && !unlocked.has("reader_1")) newly.push("reader_1");
  if (state.readPostSlugs.length >= 5 && !unlocked.has("reader_5")) newly.push("reader_5");
  if (
    state.totalPublishedSlugs.length > 0 &&
    state.totalPublishedSlugs.every((slug) => state.readPostSlugs.includes(slug)) &&
    !unlocked.has("reader_all")
  )
    newly.push("reader_all");
  if (state.usedWidgetIds.length >= 1 && !unlocked.has("explorer_1")) newly.push("explorer_1");
  if (state.usedWidgetIds.length >= 5 && !unlocked.has("explorer_5")) newly.push("explorer_5");
  if (state.completedQuizIds.length >= 3 && !unlocked.has("challenger")) newly.push("challenger");
  if (state.subscribed && !unlocked.has("subscriber")) newly.push("subscriber");
  if (state.shared && !unlocked.has("ambassador")) newly.push("ambassador");

  return newly;
}

export function unlockAchievement(id: AchievementId): void {
  if (typeof window === "undefined") return;
  const unlocked = getUnlockedAchievements();
  if (unlocked.some((u) => u.id === id)) return;
  unlocked.push({ id, unlockedAt: new Date().toISOString() });
  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  emit();
}

export function markPostRead(slug: string): void {
  const slugs = readArray(READ_POSTS_KEY);
  if (slugs.includes(slug)) return;
  slugs.push(slug);
  writeArray(READ_POSTS_KEY, slugs);
  emit();
}

export function markWidgetUsed(widgetId: string): void {
  const ids = readArray(USED_WIDGETS_KEY);
  if (ids.includes(widgetId)) return;
  ids.push(widgetId);
  writeArray(USED_WIDGETS_KEY, ids);
  emit();
}

export function markSubscribed(): void {
  writeBoolean(SUBSCRIBED_KEY, true);
  emit();
}

export function markShared(): void {
  writeBoolean(SHARED_KEY, true);
  emit();
}
