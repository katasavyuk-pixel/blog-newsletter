import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ArchiveList } from "@/components/content/content-row";
import { getPostsByTag } from "@/lib/posts";
import { getRadarCadence } from "@/lib/radar";

export const metadata: Metadata = {
  title: "Radar IA",
  description:
    "Noticias de IA, negocio y geopolítica filtradas cada semana y verificadas contra su fuente por un pipeline anti-alucinación con revisión humana.",
  alternates: { canonical: "/radar" },
};

/**
 * The Radar as a named section rather than a tag listing.
 *
 * It was reachable only at /blog/tag/radar, which is a filter URL: it cannot
 * explain what the thing is, why its claims are trustworthy, or how often it
 * ships. Those are exactly the questions a recurring series has to answer, and
 * the pipeline behind this one is a credibility asset that had nowhere to be
 * described.
 */
export default function RadarPage() {
  const editions = getPostsByTag("radar");
  const cadence = editions[0] ? getRadarCadence(editions[0].date) : null;

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
          {cadence?.label ?? "Serie semanal"}
        </p>
        <h1 className="headline mt-2 text-4xl text-fg sm:text-5xl">Radar IA</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Lo que ha pasado en IA, negocio y geopolítica, con una línea sobre por
          qué importa. Sin superlativos y sin predicciones.
        </p>
      </header>

      <section
        aria-labelledby="como-se-hace"
        className="mt-10 max-w-2xl rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <h2
          id="como-se-hace"
          className="font-mono text-xs uppercase tracking-[0.15em] text-accent-ink"
        >
          Cómo se hace
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          Un recolector lee los feeds y guarda los titulares tal cual, sin
          modelo de por medio. La redacción solo puede elegir entre esos
          titulares. Después, un verificador comprueba que cada enlace, título y
          fuente coinciden <strong className="text-fg">carácter a carácter</strong>{" "}
          con lo recolectado: si algo no cuadra, no se publica. Nada llega aquí
          sin que yo lo apruebe antes.
        </p>
      </section>

      {editions.length > 0 ? (
        <section aria-labelledby="ediciones" className="mt-14">
          <h2
            id="ediciones"
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink"
          >
            Ediciones
          </h2>
          <ArchiveList
            posts={editions}
            className="mt-4 border-t border-border"
          />
        </section>
      ) : (
        <p className="mt-12 text-muted">Aún no hay ediciones publicadas.</p>
      )}
    </Container>
  );
}
