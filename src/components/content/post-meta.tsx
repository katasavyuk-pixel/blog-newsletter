import { formatDate, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/posts";

/**
 * The `fecha · N min` line, in one place.
 *
 * It used to be hand-copied in five files with three different colours and two
 * different suffixes ("min" vs "min de lectura"), which is why the same piece of
 * metadata looked like a different component on every surface.
 *
 * Also renders `updated`, which no surface showed at all: the field was fed to
 * OpenGraph, JSON-LD and the sitemap, so machines knew a post had been revised
 * and readers did not. On a site whose argument is "probado", that is the single
 * cheapest authority signal available.
 */
export function PostMeta({
  post,
  short = false,
  className,
}: {
  post: Post;
  /** Compact date + "min", for dense rows and small cards. */
  short?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-faint",
        className,
      )}
    >
      <time dateTime={post.date}>
        {short ? formatDateShort(post.date) : formatDate(post.date)}
      </time>
      <span aria-hidden>·</span>
      <span>{post.metadata.readingTime} min{short ? "" : " de lectura"}</span>
      {post.updated ? (
        <>
          <span aria-hidden>·</span>
          <span className="text-accent-ink">
            actualizado {formatDateShort(post.updated)}
          </span>
        </>
      ) : null}
    </div>
  );
}
