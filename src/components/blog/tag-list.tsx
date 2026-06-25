import Link from "next/link";
import { cn } from "@/lib/utils";

export function TagList({
  tags,
  active,
}: {
  tags: { tag: string; count: number }[];
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
            active === tag
              ? "border-accent-strong bg-accent-strong text-on-accent"
              : "border-border text-muted hover:bg-surface hover:text-fg",
          )}
        >
          #{tag}
          <span className="text-xs opacity-70">{count}</span>
        </Link>
      ))}
    </div>
  );
}
