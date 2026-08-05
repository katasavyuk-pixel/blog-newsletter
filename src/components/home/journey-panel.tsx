import { getJourneyStatusLines, JOURNEY_WEEK } from "@/lib/journey";

export { JOURNEY_WEEK };

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
  const statusLines = getJourneyStatusLines(subscriberCount);

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
