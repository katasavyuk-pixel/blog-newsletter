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
 * Cadence strip — the weekly Radar shown as proof of a living machine
 * ("cada lunes"), compact by design so it never competes with the library
 * (Clear's 3-2-1 vs /articles separation). Hidden until an edition exists.
 */
export function CadenceStrip() {
  const latest = getLatestRadarEdition();
  if (!latest || latest.headlines.length === 0) return null;
  const { edition, headlines } = latest;

  return (
    <section className="border-y border-border bg-surface-2">
      <Container size="wide" className="py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Cada lunes · en automático</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-medium text-fg sm:text-3xl">
              Radar IA: la semana en titulares
            </h2>
          </div>
          <Link
            href="/blog/tag/radar"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Todas las ediciones →
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 lg:grid-cols-3">
          {headlines.slice(0, 3).map((item) => (
            <li key={item.url}>
              <Link
                href={edition.permalink}
                className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-bg px-2.5 py-1 font-display text-xs font-medium uppercase tracking-wider text-accent-ink">
                    {axisLabels[item.axis] ?? item.axis}
                  </span>
                  <time dateTime={item.date} className="text-xs text-faint">
                    {formatDate(item.date)}
                  </time>
                </div>
                <h3 className="font-display text-base font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                  {item.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
