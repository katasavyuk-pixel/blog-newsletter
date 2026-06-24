import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group relative flex h-full flex-col">
      <div className="flex items-center gap-2 text-xs text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.metadata.readingTime} min de lectura</span>
      </div>
      <h2 className="mt-2 font-display text-xl font-semibold text-fg">
        <Link
          href={post.permalink}
          className="transition-colors before:absolute before:inset-0 group-hover:text-accent-ink"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {post.description}
      </p>
      {post.tags.length > 0 ? (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2.5 py-1 text-xs text-accent-ink"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
