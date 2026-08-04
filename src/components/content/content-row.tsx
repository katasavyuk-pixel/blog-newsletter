import Link from "next/link";
import { FORMATOS } from "@/config/taxonomy";
import { formatDateShort } from "@/lib/format";
import type { Post } from "@/lib/posts";

/**
 * One line of the archive: date · formato · title · reading time.
 *
 * The site had no dense list anywhere — every surface was a grid of repeated
 * cards, which is the layout every landing page uses and no publication does.
 * Cards are for the handful of things being argued for; the archive is for
 * depth, and depth reads as rows. Separated by hairlines rather than boxes.
 */
export function ContentRow({ post }: { post: Post }) {
  return (
    <li>
      <Link
        href={post.permalink}
        className="group grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-border py-4 transition-colors hover:border-accent sm:grid-cols-[6rem_6.5rem_1fr_auto]"
      >
        <time
          dateTime={post.date}
          className="font-mono text-xs tabular-nums text-faint"
        >
          {formatDateShort(post.date)}
        </time>
        {/* Dropped below sm: on a phone the format label costs more width than
            it earns, and the title is what people scan. */}
        <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.15em] text-accent-ink sm:block">
          {FORMATOS[post.formato]}
        </span>
        <h3 className="font-display text-base font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
          {post.title}
        </h3>
        <span className="font-mono text-xs tabular-nums text-faint">
          {post.metadata.readingTime} min
        </span>
      </Link>
    </li>
  );
}

/** The archive itself — a plain list, deliberately not a grid. */
export function ArchiveList({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  if (posts.length === 0) return null;
  return (
    <ul className={className}>
      {posts.map((post) => (
        <ContentRow key={post.slug} post={post} />
      ))}
    </ul>
  );
}
