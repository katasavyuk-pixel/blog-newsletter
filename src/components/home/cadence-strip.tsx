import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { RADAR_AXES } from "@/config/taxonomy";
import { getLatestRadarEdition, getRadarCadence } from "@/lib/radar";
import { formatDateShort } from "@/lib/format";

/**
 * The weekly Radar as proof of a living machine. Compact by design so it never
 * competes with the library. Hidden until an edition exists.
 *
 * The cadence line is derived, not written: see getRadarCadence.
 */
export function CadenceStrip() {
  const latest = getLatestRadarEdition();
  if (!latest || latest.headlines.length === 0) return null;
  const { edition, headlines } = latest;
  const cadence = getRadarCadence(edition.date);

  return (
    <section className="border-y border-border bg-surface-2">
      <Container size="wide" className="py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{cadence.label}</Eyebrow>
            <h2 className="mt-3 headline text-3xl text-fg sm:text-4xl">
              Radar IA: la semana en titulares
            </h2>
          </div>
          <Link
            href="/radar"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Todas las ediciones →
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 lg:grid-cols-3">
          {headlines.slice(0, 3).map((item, i) => (
            <li key={item.url}>
              <ScrollReveal delay={i * 0.07} className="h-full">
                <Link
                  href={edition.permalink}
                  className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-bg px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-accent-ink">
                      {RADAR_AXES[item.axis] ?? item.axis}
                    </span>
                    <time dateTime={item.date} className="font-mono text-xs text-faint">
                      {formatDateShort(item.date)}
                    </time>
                  </div>
                  <h3 className="font-display text-base font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                    {item.title}
                  </h3>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
