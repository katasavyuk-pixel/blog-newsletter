import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowSection } from "@/components/ui/glow-section";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { JourneyPanel } from "@/components/home/journey-panel";

/**
 * Masthead — identity and entry points, not a capture form.
 *
 * This slot used to hold the first of three email forms on the page. A
 * publication's masthead does not ask for anything before it has given
 * anything; asking above the fold is the landing-page reflex that made the site
 * read as a funnel with posts attached. Capture now lives after the archive,
 * where the reader has seen the work, and in the footer.
 *
 * The visual weight stays: the oversized Anton statement is the brand's
 * signature from the video identity, and it is doing its job.
 */
export function Masthead({ subscriberCount }: { subscriberCount: number | null }) {
  return (
    <GlowSection fadeBottom>
      <Container
        size="wide"
        className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2"
      >
        <ScrollReveal className="max-w-xl">
          <Eyebrow tone="dark">construcción pública · IA aplicada a negocio</Eyebrow>

          <h1
            className="mt-5 font-punch font-normal uppercase text-on-dark text-balance"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.0 }}
          >
            Sistemas probados en un negocio real.{" "}
            <span className="text-accent">Llévatelos.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted">
            Documento cada sistema que monto para mi negocio de soluciones de
            IA: qué hace, qué me costó y cómo replicarlo.{" "}
            <strong className="font-semibold text-on-dark">
              Te servirá si ya ejecutas
            </strong>{" "}
            — si buscas atajos, no.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            <Link
              href="/sistemas"
              className="text-accent-ink transition-colors hover:text-on-dark"
            >
              ▸ Ver los sistemas
            </Link>
            <Link
              href="/empieza-aqui"
              className="text-accent-ink transition-colors hover:text-on-dark"
            >
              ▸ Empezar por el curso
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-3xl border border-dark-border-2"
          />
          <JourneyPanel subscriberCount={subscriberCount} />
        </ScrollReveal>
      </Container>
    </GlowSection>
  );
}
