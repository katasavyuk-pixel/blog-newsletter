/** Format an ISO date as a long Spanish date (e.g. "24 de junio de 2026"). */
export function formatDate(iso: string, locale = "es-ES"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
