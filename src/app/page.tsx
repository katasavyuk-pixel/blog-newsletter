import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";

export default function Home() {
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

      {/* Latest posts placeholder (wired to MDX in Fase 1) */}
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="flex h-full flex-col">
                <div className="aspect-[16/9] w-full rounded-xl bg-surface-2" />
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-accent-ink">
                  Próximamente
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-fg">
                  Aquí aparecerán tus artículos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Publica un archivo <code className="text-accent-ink">.mdx</code> y
                  aparecerá automáticamente en el listado (Fase 1).
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
