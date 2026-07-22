import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  LibraryCard,
  resolveLibraryItem,
} from "@/components/library/library-card";
import { LIBRARY_ITEMS } from "@/config/library";

/**
 * The home's curated library wall: available systems + announced gaps
 * ("en construcción"). Curation lives in library.ts; the full library is
 * /biblioteca (home-as-argument, library-as-page).
 */
export function LibraryShowcase() {
  const items = LIBRARY_ITEMS.map(resolveLibraryItem).filter(
    (item) => item !== null && !item.featured,
  );
  if (items.length === 0) return null;

  return (
    <section className="bg-bg">
      <Container size="wide" className="py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>La biblioteca de sistemas</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Lo que ya funciona, listo para copiar
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Cada pieza sale de algo construido de verdad — en NBI o en este
              mismo blog. Lo que está en el taller llegará con su guía.
            </p>
          </div>
          <Link
            href="/biblioteca"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Ver toda la biblioteca →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <LibraryCard key={item!.id} item={item!} />
          ))}
        </div>
      </Container>
    </section>
  );
}
