import { cn } from "@/lib/utils";

type CredibilityBadgesProps = {
  weekNumber: number;
  subscriberCount: number | null;
  postCount: number;
  className?: string;
};

/**
 * Honest social-proof pills — every value is real data already computed by
 * the caller (week number, gated subscriber count, published post count).
 * No invented numbers: a null subscriberCount renders a no-metric fallback
 * instead of a placeholder or a zero.
 */
export function CredibilityBadges({
  weekNumber,
  subscriberCount,
  postCount,
  className,
}: CredibilityBadgesProps) {
  const pills = [
    { glyph: "▸", label: `Semana ${weekNumber} construyendo en público` },
    subscriberCount != null
      ? { glyph: "◉", label: `${subscriberCount}+ suscriptores` }
      : { glyph: "◉", label: "Construido en público, sin humo" },
    { glyph: "✎", label: `${postCount} sistemas documentados` },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium text-eyebrow"
        >
          <span aria-hidden className="text-salmon">
            {pill.glyph}
          </span>
          {pill.label}
        </span>
      ))}
    </div>
  );
}
