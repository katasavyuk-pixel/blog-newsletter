import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { siteConfig } from "@/config/site";
import type { UniverseData } from "@/config/universe";

/**
 * The universe as plain HTML — server-rendered under the map. This is the
 * home's semantic truth: crawlable h1 + real links to every destination, the
 * keyboard/screen-reader path, the "Vista lista" target and the no-JS
 * fallback, plus the anchored capture form (la Señal's landline).
 */
export function SemanticLayer({ data }: { data: UniverseData }) {
  const { astros, week } = data;
  const constellation = astros.find((a) => a.kind === "constelacion");
  const pulsar = astros.find((a) => a.kind === "pulsar");
  const systems = astros.filter((a) => a.kind === "sistema");
  const forming = astros.filter((a) => a.kind === "protoestrella");
  const comets = astros.filter((a) => a.kind === "cometa");

  return (
    <section id="vista-lista" className="relative border-t border-border bg-bg">
      <Container size="wide" className="py-16 sm:py-20">
        <p className="font-mono text-xs tracking-wide text-muted">
          <span aria-hidden className="text-salmon">
            ▸{" "}
          </span>
          semana {week} construyendo en público · big bang: 24-06-2026
        </p>
        <h1 className="mt-3 max-w-3xl font-punch text-4xl uppercase leading-tight text-fg sm:text-5xl">
          El universo de {siteConfig.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {siteConfig.description}
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <nav aria-label="La Constelación — el curso" className="flex flex-col gap-2.5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-eyebrow">
              La Constelación · curso
            </h2>
            <p className="text-sm text-muted">{constellation?.blurb}</p>
            {(constellation?.stars ?? []).map((star) => (
              <Link
                key={star.slug}
                href={`/blog/${star.slug}`}
                className="text-sm text-fg transition-colors hover:text-accent-ink"
              >
                <span aria-hidden className="font-mono text-salmon">
                  {star.glyph}{" "}
                </span>
                {star.title}
              </Link>
            ))}
            <Link
              href="/empieza-aqui"
              className="mt-1 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
            >
              Empezar el curso →
            </Link>
          </nav>

          <nav aria-label="Sistemas y protoestrellas" className="flex flex-col gap-2.5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-eyebrow">
              Sistemas estelares
            </h2>
            {systems.map((astro) =>
              astro.href ? (
                <Link
                  key={astro.id}
                  href={astro.href}
                  className="text-sm text-fg transition-colors hover:text-accent-ink"
                >
                  <span aria-hidden className="font-mono text-salmon">
                    {astro.glyph}{" "}
                  </span>
                  {astro.name}
                </Link>
              ) : null,
            )}
            {forming.map((astro) => (
              <p key={astro.id} className="text-sm text-muted">
                <span aria-hidden className="font-mono">
                  ◌{" "}
                </span>
                {astro.name}{" "}
                <span className="font-mono text-xs text-faint">
                  · formación {astro.progress}%
                </span>
              </p>
            ))}
            <Link
              href="/sistemas"
              className="mt-1 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
            >
              Toda la biblioteca de sistemas →
            </Link>
          </nav>

          <nav aria-label="Radar, viaje y archivo" className="flex flex-col gap-2.5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-eyebrow">
              El Radar · cada lunes
            </h2>
            {(pulsar?.blips ?? []).map((blip) => (
              <p key={blip.url} className="text-sm text-muted">
                <span aria-hidden className="font-mono text-salmon">
                  ◉{" "}
                </span>
                {blip.title}
              </p>
            ))}
            <Link
              href="/blog/tag/radar"
              className="text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
            >
              Leer el radar →
            </Link>
            {comets.length > 0 ? (
              <>
                <h2 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-eyebrow">
                  Cometas recientes
                </h2>
                {comets.map((astro) =>
                  astro.href ? (
                    <Link
                      key={astro.id}
                      href={astro.href}
                      className="text-sm text-fg transition-colors hover:text-accent-ink"
                    >
                      {astro.name}
                    </Link>
                  ) : null,
                )}
              </>
            ) : null}
            <Link
              href="/sobre-mi"
              className="mt-4 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
            >
              El origen: quién construye esto →
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              Archivo cronológico completo →
            </Link>
          </nav>
        </div>

        <div
          id="senal"
          className="mt-16 max-w-xl rounded-2xl border border-dark-border-2 bg-dark p-6 text-on-dark sm:p-8"
        >
          <h2 className="font-punch text-2xl uppercase tracking-wide">La Señal</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
            {siteConfig.newsletter.magnet} Sin spam — ni tengo tiempo de mandarlo.
          </p>
          <div className="mt-4">
            <SubscribeForm source="senal-lista" tone="dark" />
          </div>
        </div>
      </Container>
    </section>
  );
}
