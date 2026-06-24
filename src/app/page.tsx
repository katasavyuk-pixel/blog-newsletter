import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { PostCard } from "@/components/blog/post-card";
import { allPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export default function Home() {
  const latest = allPosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
        />
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent-ink">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              Blog + newsletter sobre IA
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-fg text-balance sm:text-6xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/recursos" size="lg">
                Recurso gratuito
              </Button>
              <Button href="/blog" variant="secondary" size="lg">
                Leer el blog
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest posts */}
      <section>
        <Container className="border-t border-border py-16">
          <div className="flex items-end justify-between gap-4">
            <Heading level={2}>Últimos artículos</Heading>
            <Link
              href="/blog"
              className="text-sm font-medium text-accent-ink hover:underline"
            >
              Ver todos →
            </Link>
          </div>

          {latest.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-muted">
              Aún no hay artículos publicados. Añade un{" "}
              <code className="text-accent-ink">.mdx</code> en{" "}
              <code className="text-accent-ink">content/posts/</code>.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
