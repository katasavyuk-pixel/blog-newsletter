import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconChip } from "@/components/ui/icon-chip";
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
  "flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card";

/**
 * One deliverable of the Biblioteca de Sistemas. Available items link to the
 * deliverable; "en construcción" cards are the announced gaps — real work in
 * progress with an honest progress bar (anticipation, not filler).
 */
export function LibraryCard({ item }: { item: ResolvedLibraryItem }) {
  if (item.status === "en-construccion") {
    return (
      <div className={`${cardClasses} border-dashed`}>
        <div className="flex items-start justify-between gap-3">
          <IconChip color={item.color}>{item.glyph}</IconChip>
          <Badge tone="neutral">En el taller</Badge>
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
      href={item.href ?? "/biblioteca"}
      className={`group ${cardClasses} transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover`}
    >
      <IconChip color={item.color}>{item.glyph}</IconChip>
      <h3 className="mt-4 font-display text-xl font-medium text-fg group-hover:text-accent-ink">
        {item.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
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
