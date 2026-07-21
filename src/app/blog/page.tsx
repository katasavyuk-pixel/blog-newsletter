import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/blog/post-card";
import { TagList } from "@/components/blog/tag-list";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { allPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/** Weekly "Radar IA" editions live in their own strip, not the main grid. */
const RADAR_TAG = "radar";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos interactivos sobre inteligencia artificial: del fundamento a la práctica, sin humo.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const tags = getAllTags();
  const articles = allPosts.filter((post) => !post.tags.includes(RADAR_TAG));
  const radarEditions = getPostsByTag(RADAR_TAG).slice(0, 3);
  const [featured, ...rest] = articles;

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
          Blog
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Aprende IA tocándola
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Artículos donde no solo lees cómo funciona la IA: la manipulas.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-8">
          <TagList tags={tags} />
        </div>
      ) : null}

      {!featured ? (
        <p className="mt-12 text-muted">
          Aún no hay artículos. Añade un{" "}
          <code className="text-accent-ink">.mdx</code> en{" "}
          <code className="text-accent-ink">content/posts/</code>.
        </p>
      ) : (
        <>
          {/* Featured (bento hero) */}
          <ScrollReveal>
            <Link
              href={featured.permalink}
              className="group relative mt-10 block overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-colors hover:border-accent sm:p-10"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-accent), transparent 70%)",
                }}
              />
              <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
                {featured.kicker ?? "Destacado"}
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl font-medium tracking-tight text-fg text-balance transition-colors group-hover:text-accent-ink sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-muted">{featured.description}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span aria-hidden>·</span>
                <span>{featured.metadata.readingTime} min</span>
              </div>
            </Link>
          </ScrollReveal>

          {radarEditions.length > 0 ? (
            <ScrollReveal>
              <section
                aria-labelledby="radar-heading"
                className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2
                    id="radar-heading"
                    className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink"
                  >
                    Radar IA — la semana en titulares
                  </h2>
                  <Link
                    href={`/blog/tag/${RADAR_TAG}`}
                    className="text-sm text-accent-ink hover:underline"
                  >
                    Todas las ediciones →
                  </Link>
                </div>
                <ul className="mt-4 divide-y divide-border">
                  {radarEditions.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={post.permalink}
                        className="group flex flex-wrap items-baseline justify-between gap-2 py-3"
                      >
                        <span className="font-display font-medium text-fg transition-colors group-hover:text-accent-ink">
                          {post.title}
                        </span>
                        <time dateTime={post.date} className="text-sm text-muted">
                          {formatDate(post.date)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </ScrollReveal>
          ) : null}

          {rest.length > 0 ? (
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {rest.map((post, i) => (
                <ScrollReveal key={post.slug} delay={i * 0.06}>
                  <PostCard post={post} />
                </ScrollReveal>
              ))}
            </div>
          ) : null}
        </>
      )}
    </Container>
  );
}
