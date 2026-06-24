import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { PostCard } from "@/components/blog/post-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { allPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export default function Home() {
  const latest = allPosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="animate-gradient-pan absolute -top-1/3 left-1/2 h-[55rem] w-[55rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, var(--color-accent), transparent 60%), radial-gradient(circle at 70% 70%, var(--color-accent-strong), transparent 60%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
        </div>

        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-accent-ink backdrop-blur">
              <span
                aria-hidden
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
              />
              Blog + newsletter sobre IA, de verdad interactivo
            </span>
            <h1
              className="mt-6 font-display font-bold tracking-tight text-fg text-balance"
              style={{ fontSize: "var(--text-hero)", lineHeight: 1.02 }}
            >
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              {siteConfig.description} Aquí no solo lees cómo funciona la IA:{" "}
              <strong className="text-fg">metes la mano y giras el mando</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/blog/que-es-un-token" size="lg">
                Prueba un artículo interactivo
              </Button>
              <Button href="/recursos" variant="secondary" size="lg">
                Recurso gratuito
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest posts */}
      <section>
        <Container className="border-t border-border py-16">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-4">
              <Heading level={2}>Últimos artículos</Heading>
              <Link
                href="/blog"
                className="text-sm font-medium text-accent-ink hover:underline"
              >
                Ver todos →
              </Link>
            </div>
          </ScrollReveal>

          {latest.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post, i) => (
                <ScrollReveal key={post.slug} delay={i * 0.08}>
                  <PostCard post={post} />
                </ScrollReveal>
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
