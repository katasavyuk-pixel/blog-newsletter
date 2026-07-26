/** Format an ISO date as a long Spanish date (e.g. "24 de junio de 2026"). */
export function formatDate(iso: string, locale = "es-ES"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Weeks elapsed since an ISO start date, floored to 1 (never "week 0"). */
export function weekNumberSince(startIso: string): number {
  return Math.max(
    1,
    Math.floor((Date.now() - +new Date(startIso)) / MS_PER_WEEK) + 1,
  );
}
