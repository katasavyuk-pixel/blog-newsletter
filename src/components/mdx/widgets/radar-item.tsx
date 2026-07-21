import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

type RadarAxis = "ia" | "negocio" | "geopolitica";

const axisLabels: Record<RadarAxis, string> = {
  ia: "IA",
  negocio: "Negocio",
  geopolitica: "Geopolítica",
};

/**
 * One news item inside a weekly "Radar IA" edition (server component).
 * Headline + source link come from the RSS collector (real data); the
 * children hold the "por qué importa" analysis written for the edition.
 */
export function RadarItem({
  title,
  source,
  url,
  date,
  axis,
  children,
}: {
  title: string;
  source: string;
  url: string;
  date: string;
  axis: RadarAxis;
  children: ReactNode;
}) {
  return (
    <article className="not-prose my-6 rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-bg px-2.5 py-1 font-display font-medium uppercase tracking-wider text-accent-ink">
          {axisLabels[axis] ?? axis}
        </span>
        <time dateTime={date}>{formatDate(date)}</time>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-fg">
        {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-fg [&_p]:mt-2 first:[&_p]:mt-0">
        {children}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-accent-ink hover:underline"
      >
        Leer en {source} ↗
      </a>
    </article>
  );
}
