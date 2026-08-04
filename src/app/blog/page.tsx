import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArchiveList } from "@/components/content/content-row";
import { PostMeta } from "@/components/content/post-meta";
import { TagList } from "@/components/blog/tag-list";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { FORMATOS, TEMAS } from "@/config/taxonomy";
import { allPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Artículos",
  description:
    "El archivo completo: sistemas, lecciones interactivas, notas y las ediciones del Radar IA.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const tags = getAllTags();
  // The lead is the newest substantive piece. A Radar edition is a weekly
  // roundup, not an argument, so it never opens the page — but it does belong
  // in the archive below, where its formato column identifies it on sight.
  const lead = allPosts.find((post) => post.formato !== "radar");
  const rest = allPosts.filter((post) => post.slug !== lead?.slug);

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
          Archivo
        </p>
        <h1 className="headline mt-2 text-4xl text-fg sm:text-5xl">
          Todo lo que he publicado
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Sistemas, lecciones interactivas, notas y las ediciones del Radar. Lo
          más reciente arriba.
        </p>
      </header>

      {!lead ? (
        <p className="mt-12 text-muted">
          Aún no hay artículos. Añade un{" "}
          <code className="text-accent-ink">.mdx</code> en{" "}
          <code className="text-accent-ink">content/posts/</code>.
        </p>
      ) : (
        <>
          {/* Lead story — the one piece the page argues for. */}
          <ScrollReveal>
            <Link
              href={lead.permalink}
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
              <p className="font-mono text-xs uppercase tracking-[0.2em]">
                <span className="text-accent-ink">{FORMATOS[lead.formato]}</span>
                <span aria-hidden className="text-faint">
                  {" · "}
                </span>
                <span className="text-faint">{TEMAS[lead.tema]}</span>
              </p>
              <h2 className="headline mt-3 max-w-3xl text-3xl text-fg text-balance transition-colors group-hover:text-accent-ink sm:text-4xl">
                {lead.title}
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                {lead.dek ?? lead.description}
              </p>
              <PostMeta post={lead} className="mt-5" />
            </Link>
          </ScrollReveal>

          {/* The archive proper: rows, not a grid of repeated cards. */}
          {rest.length > 0 ? (
            <section aria-labelledby="archivo" className="mt-16">
              <h2
                id="archivo"
                className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink"
              >
                Archivo
              </h2>
              <ArchiveList posts={rest} className="mt-4 border-t border-border" />
            </section>
          ) : null}
        </>
      )}

      {tags.length > 0 ? (
        <section aria-labelledby="temas" className="mt-16">
          <h2
            id="temas"
            className="font-mono text-xs uppercase tracking-[0.2em] text-faint"
          >
            Filtrar por palabra clave
          </h2>
          <div className="mt-4">
            <TagList tags={tags} />
          </div>
          <p className="mt-4 text-sm text-muted">
            ¿Buscas un término suelto?{" "}
            <Link href="/glosario" className="text-accent-ink hover:underline">
              Consulta el glosario →
            </Link>
          </p>
        </section>
      ) : null}
    </Container>
  );
}
