import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { glossary } from "@/lib/glossary";
import { getPost } from "@/lib/posts";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbJsonLd, definedTermJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return Object.keys(glossary).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = glossary[id];
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.def,
    alternates: { canonical: `/glosario/${id}` },
  };
}

export default async function GlossaryEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = glossary[id];
  if (!entry) notFound();

  const relatedPost = entry.relatedSlug ? getPost(entry.relatedSlug) : undefined;

  return (
    <Container className="py-16">
      {/* DefinedTerm, not FAQPage: this page really is a named concept with a
          definition inside a set, and that data already exists in glossary.ts. */}
      <JsonLd
        data={[
          definedTermJsonLd({ id, title: entry.title, def: entry.def }),
          breadcrumbJsonLd([
            { name: "Glosario", path: "/glosario" },
            { name: entry.title, path: `/glosario/${id}` },
          ]),
        ]}
      />
      <div className="mx-auto max-w-2xl">
        <Link
          href="/glosario"
          className="text-sm font-medium text-accent-ink hover:underline"
        >
          ← Volver al glosario
        </Link>
        <p className="mt-6 font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
          Glosario
        </p>
        <h1 className="mt-3 headline text-4xl text-fg sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{entry.def}</p>

        {relatedPost ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">
              Este término se explica a fondo, con ejemplos interactivos, en:
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold text-fg">
              {relatedPost.title}
            </h2>
            <div className="mt-4">
              <Button href={relatedPost.permalink} size="sm">
                Leer el artículo completo →
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
}
