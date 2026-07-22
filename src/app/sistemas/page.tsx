import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  LibraryCard,
  resolveLibraryItem,
  type ResolvedLibraryItem,
} from "@/components/library/library-card";
import { LIBRARY_ITEMS, LIBRARY_THEMES } from "@/config/library";
import { getPublishedResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Biblioteca de Sistemas",
  description:
    "Sistemas replicables probados en un negocio real: curso interactivo de IA, herramientas, guías y plantillas — gratis, con lo que está en construcción a la vista.",
  alternates: { canonical: "/sistemas" },
};

/**
 * The full library, organized by theme with curated blocks (Clear /articles
 * model): available deliverables first, announced gaps in place, downloadable
 * resources integrated, chronological archive linked at the end.
 */
export default async function BibliotecaPage() {
  const resources = await getPublishedResources();
  const resolved = LIBRARY_ITEMS.map(resolveLibraryItem).filter(
    (item): item is ResolvedLibraryItem => item !== null,
  );
  const themes = (
    Object.entries(LIBRARY_THEMES) as [keyof typeof LIBRARY_THEMES, string][]
  )
    .map(([tema, label]) => ({
      label,
      items: resolved.filter((item) => item.tema === tema),
    }))
    .filter((block) => block.items.length > 0);

  return (
    <Container size="wide" className="py-16">
      <header className="max-w-2xl">
        <Eyebrow>Gratis · probado · replicable</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          La Biblioteca de Sistemas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Todo lo que ya funciona en un negocio real, listo para que lo copies
          en el tuyo. Lo que está en el taller se construye a la vista — cada
          pieza llega con su guía, y los suscriptores la reciben primero.
        </p>
      </header>

      {themes.map((block) => (
        <section key={block.label} className="mt-14">
          <h2 className="font-display text-2xl font-medium text-fg">
            {block.label}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-fg">
          Recursos descargables
        </h2>
        {resources.length === 0 ? (
          <p className="mt-4 max-w-prose text-muted">
            Las primeras guías descargables llegan con los sistemas que están
            en el taller.{" "}
            <Link
              href="/recursos"
              className="text-accent-ink underline transition-colors hover:text-accent-strong"
            >
              Suscríbete en recursos y te aviso →
            </Link>
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <li key={resource.id}>
                <Link
                  href="/recursos"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
                >
                  <h3 className="font-display text-lg font-medium text-fg group-hover:text-accent-ink">
                    {resource.title}
                  </h3>
                  {resource.description ? (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {resource.description}
                    </p>
                  ) : null}
                  <p className="mt-4 font-mono text-xs text-faint">
                    ▸ gratis a cambio de tu email
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-16 border-t border-border pt-8 text-sm text-muted">
        ¿Buscas algo que no está aquí? El archivo cronológico completo vive en{" "}
        <Link
          href="/blog"
          className="text-accent-ink underline transition-colors hover:text-accent-strong"
        >
          el blog →
        </Link>
      </p>
    </Container>
  );
}
