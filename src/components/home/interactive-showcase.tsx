import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { IconChip } from "@/components/ui/icon-chip";
import { getPostsByTag } from "@/lib/posts";

type ChipColor = "coral" | "navy" | "toffee" | "forest";
type ShowcaseMeta = { color: ChipColor; glyph: string; level: string; format: string };

/** Per-post presentation derived from the real interactive widget each article ships. */
const SHOWCASE: Record<string, ShowcaseMeta> = {
  "que-es-un-token": { color: "navy", glyph: "▦", level: "Básico", format: "Tokenizador" },
  "temperatura-y-aleatoriedad": { color: "toffee", glyph: "∿", level: "Básico", format: "Sandbox" },
  "cuanto-cuesta-la-ia": { color: "forest", glyph: "€", level: "Práctica", format: "Calculadora" },
  "cuando-la-ia-alucina": { color: "coral", glyph: "?", level: "Intermedio", format: "Quiz" },
  "vida-de-un-prompt": { color: "navy", glyph: "▷", level: "Básico", format: "Scrollytelling" },
};

const FALLBACK: ShowcaseMeta = {
  color: "coral",
  glyph: "◆",
  level: "Artículo",
  format: "Interactivo",
};

/** Cream band showcasing the interactive posts ("toca y aprende") instead of fake courses. */
export function InteractiveShowcase() {
  const cards = getPostsByTag("interactivo").slice(0, 4);
  if (cards.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-2">
      <Container size="wide" className="py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Gratis · interactivo</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Formación gratuita e interactiva
            </h2>
          </div>
          <Link
            href="/blog/tag/interactivo"
            className="font-mono text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Todos los artículos →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((post) => {
            const meta = SHOWCASE[post.slug] ?? FALLBACK;
            return (
              <Link
                key={post.slug}
                href={post.permalink}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
              >
                <IconChip color={meta.color}>{meta.glyph}</IconChip>
                <h3 className="mt-4 font-display text-xl font-medium text-fg group-hover:text-accent-ink">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {post.dek ?? post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="green">{meta.level}</Badge>
                  <Badge tone="blue">{meta.format}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
