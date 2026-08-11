import Link from "next/link";
import { PostMeta } from "@/components/content/post-meta";
import { TagPill } from "@/components/content/tag-pill";
import { TiltCard } from "@/components/motion/tilt-card";
import { FORMATOS, TEMAS } from "@/config/taxonomy";
import type { Post } from "@/lib/posts";

/**
 * Card for a single piece. Reading order is fixed across every card on the
 * site: formato + tema → headline → dek → meta.
 *
 * Uses bg-surface like every other card. The shared `Card` primitive it used to
 * wrap was the only surface in the system on bg-bg, so post cards sat a shade
 * darker than their neighbours for no reason anyone chose.
 *
 * The hover lift is a real tilt now, so the visual classes live on `TiltCard`:
 * a CSS `transition-all` there would fight the transform motion writes every
 * frame, and the old `hover:-translate-y-0.5` would never be seen at all.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative h-full">
      <TiltCard className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-[border-color,box-shadow] group-hover:border-accent group-hover:shadow-card-hover">
        <div className="flex flex-wrap items-center gap-x-2 font-mono text-[0.7rem] uppercase tracking-[0.15em]">
          <span className="text-accent-ink">{FORMATOS[post.formato]}</span>
          <span aria-hidden className="text-faint">
            ·
          </span>
          <span className="text-faint">{TEMAS[post.tema]}</span>
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-fg">
          <Link
            href={post.permalink}
            className="transition-colors before:absolute before:inset-0 group-hover:text-accent-ink"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {post.dek ?? post.description}
        </p>
        <PostMeta post={post} short className="mt-4" />
        {post.tags.length > 0 ? (
          <div className="relative mt-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </TiltCard>
    </article>
  );
}
