import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getLatestRadarEdition } from "@/lib/radar";
import { formatDate } from "@/lib/format";

const axisLabels: Record<string, string> = {
  ia: "IA",
  negocio: "Negocio",
  geopolitica: "Geopolítica",
};

/**
 * "Noticias de la semana" band (Inicio design) — the latest Radar IA
 * edition's headlines as cards. Renders nothing until an edition exists.
 */
export function NewsToday() {
  const latest = getLatestRadarEdition();
  if (!latest || latest.headlines.length === 0) return null;
  const { edition, headlines } = latest;

  return (
    <section className="bg-bg">
      <Container size="wide" className="pt-16 sm:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>En portada · {formatDate(edition.date)}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Noticias de la semana en IA
            </h2>
          </div>
          <Link
            href="/blog/tag/radar"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Todas las ediciones →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {headlines.slice(0, 4).map((item) => (
            <Link
              key={item.url}
              href={edition.permalink}
              className="group flex min-h-[13rem] flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-bg px-2.5 py-1 font-display text-xs font-medium uppercase tracking-wider text-accent-ink">
                  {axisLabels[item.axis] ?? item.axis}
                </span>
                <time dateTime={item.date} className="text-xs text-faint">
                  {formatDate(item.date)}
                </time>
              </div>
              <h3 className="font-display text-lg font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                {item.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-muted">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
