import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandVisual } from "@/components/ui/brand-visual";
import { allPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/** Featured newest post (left) + a numbered list of the next four (right). */
export function BlogHighlights() {
  const [featured, ...rest] = allPosts;
  const rows = rest.slice(0, 4);
  if (!featured) return null;

  const featuredKicker = featured.kicker ?? featured.tags[0] ?? "Artículo";

  return (
    <section className="bg-bg">
      <Container size="wide" className="py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-medium text-fg sm:text-4xl">
            Últimos artículos del blog
          </h2>
          <Link
            href="/blog"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Ir al blog →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Featured */}
          <article className="group relative">
            <Link href={featured.permalink} className="block">
              <BrandVisual
                label={featuredKicker}
                labelClassName="px-8 text-center text-2xl not-italic sm:text-3xl"
                className="aspect-[16/10] w-full"
              />
              <div className="mt-5 flex items-center gap-2 font-display text-xs">
                <span className="uppercase tracking-wide text-accent-ink">
                  {featuredKicker}
                </span>
                <span aria-hidden className="text-faint">
                  ·
                </span>
                <span className="text-faint">
                  {featured.metadata.readingTime} min de lectura
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-medium text-fg transition-colors group-hover:text-accent-ink sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                {featured.dek ?? featured.description}
              </p>
            </Link>
          </article>

          {/* List */}
          <ol className="flex flex-col">
            {rows.map((post, i) => {
              const kicker = post.kicker ?? post.tags[0] ?? "Artículo";
              return (
                <li key={post.slug}>
                  <Link
                    href={post.permalink}
                    className="group flex gap-5 border-b border-border py-5 transition-opacity hover:opacity-80"
                  >
                    <span
                      aria-hidden
                      className="min-w-[1.75rem] font-punch text-3xl text-gold"
                    >
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 font-display text-xs">
                        <span className="uppercase tracking-wide text-accent-ink">
                          {kicker}
                        </span>
                        <span aria-hidden className="text-faint">
                          ·
                        </span>
                        <span className="text-faint">
                          {post.metadata.readingTime} min
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-lg font-medium text-fg group-hover:text-accent-ink">
                        {post.title}
                      </h4>
                      <p className="mt-1 text-xs text-faint">
                        {formatDate(post.date)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
