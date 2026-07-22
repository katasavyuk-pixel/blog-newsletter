import { allPosts, getPostsByTag } from "@/lib/posts";
import { LIBRARY_ITEMS } from "@/config/library";
import { siteConfig } from "@/config/site";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Journey week, frozen per build/revalidation (module scope keeps render pure). */
const JOURNEY_WEEK =
  Math.floor(
    (Date.now() - new Date(siteConfig.journey.start).getTime()) / WEEK_MS,
  ) + 1;

/**
 * The journey status panel — the old `kata --status` lab console promoted to
 * hero visual: real build-time metrics of a business being built in public
 * (radical-transparency pattern, levels.io school). Server component; the
 * subscriber count arrives by prop so the page controls the Supabase fetch.
 */
export function JourneyPanel({
  subscriberCount,
}: {
  subscriberCount: number | null;
}) {
  const week = JOURNEY_WEEK;
  const published = LIBRARY_ITEMS.filter((i) => i.status === "disponible").length;
  const building = LIBRARY_ITEMS.filter(
    (i) => i.status === "en-construccion",
  ).length;
  const latestRadar = getPostsByTag("radar")[0];
  const showCount =
    subscriberCount !== null &&
    subscriberCount >= siteConfig.newsletter.showCountFrom;

  const statusLines = [
    `misión: ${siteConfig.journey.mission}`,
    `semana ${week} · construyendo en público`,
    `sistemas: ${published} publicados · ${building} en el taller`,
    `${allPosts.length} artículos · ${getPostsByTag("interactivo").length} interactivos`,
    latestRadar ? `radar: edición ${latestRadar.date.slice(0, 10)} ✓` : null,
    showCount ? `suscriptores: ${subscriberCount}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="relative rounded-3xl border border-dark-border-2 bg-dark-input/60 p-5 shadow-card sm:p-6">
      <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-on-dark-faint">
        <span
          aria-hidden
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent"
        />
        EN DIRECTO — estado del viaje
      </p>

      <div className="mt-4 rounded-xl border border-dark-border bg-dark p-4 font-mono text-sm leading-relaxed text-on-dark-faint">
        <p className="text-on-dark-muted">
          <span className="text-salmon">$</span> kata --status
        </p>
        {statusLines.map((line) => (
          <p key={line}>
            <span aria-hidden className="text-salmon">
              ▸{" "}
            </span>
            {line}
          </p>
        ))}
        <p aria-hidden className="animate-pulse text-salmon">
          ▍
        </p>
      </div>

      <p className="mt-3 font-mono text-xs text-on-dark-faint">
        números reales, congelados en el último build — sin métricas infladas
      </p>
    </div>
  );
}
