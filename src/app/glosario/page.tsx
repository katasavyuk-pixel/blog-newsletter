import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { glossary } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glosario",
  description:
    "Términos de IA explicados en una frase: tokens, embeddings, RAG, prompts, alucinaciones y más.",
  alternates: { canonical: "/glosario" },
};

export default function GlossaryPage() {
  const entries = Object.entries(glossary).sort((a, b) =>
    a[1].title.localeCompare(b[1].title, "es"),
  );

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
          Glosario
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Términos de IA, sin rodeos
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Los mismos términos que aparecen subrayados dentro de los artículos,
          reunidos aquí en una sola página.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {entries.map(([id, entry]) => (
          <li key={id}>
            <Link
              href={`/glosario/${id}`}
              className="group block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-ink/60"
            >
              <h2 className="font-display text-lg font-semibold text-fg transition-colors group-hover:text-accent-ink">
                {entry.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {entry.def}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
