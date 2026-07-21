import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";

/** "Sigue leyendo" — related articles at the end of a post, so the reading flow never dead-ends. */
export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <aside aria-labelledby="related-heading" className="mt-14 border-t border-border pt-10">
      <h2
        id="related-heading"
        className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink"
      >
        Sigue leyendo
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.permalink}
            className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <div className="flex items-center gap-2 text-xs text-faint">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.metadata.readingTime} min</span>
            </div>
            <h3 className="mt-2 flex-1 font-display text-base font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </aside>
  );
}
