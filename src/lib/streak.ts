export const STREAK_KEY = "streak:state";
export const STREAK_HISTORY_KEY = "streak:history";

export interface StreakState {
  current: number;
  longest: number;
  lastVisit: string;
}

const DEFAULT: StreakState = { current: 0, longest: 0, lastVisit: "" };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(d: string): boolean {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d === y.toISOString().slice(0, 10);
}

function read(): StreakState {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? (JSON.parse(raw) as StreakState) : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

function write(s: StreakState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

export function getStreak(): StreakState {
  return read();
}

export function recordVisit(): StreakState {
  const s = read();
  const now = today();

  if (s.lastVisit === now) return s;

  if (isYesterday(s.lastVisit)) {
    s.current += 1;
  } else {
    s.current = 1;
  }

  s.lastVisit = now;
  if (s.current > s.longest) s.longest = s.current;

  write(s);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nbi:local-state"));
  return s;
}
