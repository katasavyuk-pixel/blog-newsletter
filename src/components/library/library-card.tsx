import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/utils";
import type { LibraryItem } from "@/config/library";
import { getPost } from "@/lib/posts";

export type ResolvedLibraryItem = LibraryItem & { title: string; blurb: string };

/** Hydrate a config item from its backing post (when slug is set). */
export function resolveLibraryItem(
  item: LibraryItem,
): ResolvedLibraryItem | null {
  if (item.slug) {
    const post = getPost(item.slug);
    if (!post) return null;
    return {
      ...item,
      title: item.title ?? post.title,
      blurb: item.blurb ?? post.dek ?? post.description,
      href: item.href ?? post.permalink,
    };
  }
  if (!item.title || !item.blurb) return null;
  return item as ResolvedLibraryItem;
}

const cardClasses =
  "relative isolate overflow-hidden flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card";

/** Oversized chrome numeral — the signature "Kata Pro" detail on each card. */
function Ordinal({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      className="chrome-text pointer-events-none absolute right-4 top-2 font-punch text-5xl opacity-60"
    >
      {value}
    </span>
  );
}

/** Radial crimson halo for the featured (double-width) card. */
function Halo() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(420px 260px at 85% -10%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 65%)",
      }}
    />
  );
}

/**
 * One deliverable of the Biblioteca de Sistemas. Available items link to the
 * deliverable; "en construcción" cards are the announced gaps — real work in
 * progress with an honest progress bar (anticipation, not filler).
 * `hero` renders the double-width bento variant with a crimson halo;
 * `ordinal` prints the oversized chrome numeral.
 */
export function LibraryCard({
  item,
  ordinal,
  hero = false,
}: {
  item: ResolvedLibraryItem;
  ordinal?: string;
  hero?: boolean;
}) {
  if (item.status === "en-construccion") {
    return (
      <div className={cn(cardClasses, "border-dashed")}>
        {ordinal ? <Ordinal value={ordinal} /> : null}
        <div className="flex items-start justify-between gap-3">
          <IconChip color={item.color}>{item.glyph}</IconChip>
          <Badge tone="neutral" className={ordinal ? "mr-14" : undefined}>
            En el taller
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-xl font-medium text-fg">
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {item.blurb}
        </p>
        <div className="mt-4">
          <div
            role="progressbar"
            aria-valuenow={item.progress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso de ${item.title}`}
            className="h-1.5 overflow-hidden rounded-full bg-bg"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${item.progress ?? 0}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-faint">
            ▸ construyéndose en NBI · {item.format}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href ?? "/sistemas"}
      className={cn(
        "group",
        cardClasses,
        "transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover",
        hero && "p-8 sm:p-10",
      )}
    >
      {hero ? <Halo /> : null}
      {ordinal ? <Ordinal value={ordinal} /> : null}
      <IconChip color={item.color}>{item.glyph}</IconChip>
      <h3
        className={cn(
          "mt-4 font-display font-medium text-fg group-hover:text-accent-ink",
          hero ? "text-2xl sm:text-3xl" : "text-xl",
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "mt-2 flex-1 leading-relaxed text-muted",
          hero ? "max-w-xl text-base" : "text-sm",
        )}
      >
        {item.blurb}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="blue">{item.format}</Badge>
        {item.proof ? (
          <span className="font-mono text-xs text-faint">▸ {item.proof}</span>
        ) : null}
      </div>
    </Link>
  );
}
