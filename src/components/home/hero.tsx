import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowSection } from "@/components/ui/glow-section";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { JourneyPanel } from "@/components/home/journey-panel";
import { siteConfig } from "@/config/site";

/**
 * Dark, glowing two-column hero — identity + capture left (form #1 of 2 on
 * the home, named magnet, identity filter), the live journey panel right.
 */
export function Hero({ subscriberCount }: { subscriberCount: number | null }) {
  return (
    <GlowSection fadeBottom>
      <Container
        size="wide"
        className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2"
      >
        <div className="max-w-xl">
          <Eyebrow tone="dark">
            construyendo una empresa de IA en público
          </Eyebrow>

          <h1
            className="mt-5 font-punch font-normal uppercase text-on-dark text-balance"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.0 }}
          >
            Sistemas probados en un negocio real.{" "}
            <span className="text-accent">Llévatelos.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted">
            Estoy montando NBI, una empresa de IA, con las puertas abiertas:
            cada sistema que funciona, te lo llevas para tu negocio.{" "}
            <strong className="font-semibold text-on-dark">
              Para emprendedores en marcha
            </strong>{" "}
            — si buscas humo o atajos, no es tu sitio.
          </p>

          <div className="mt-8 max-w-lg">
            <SubscribeForm source="hero" tone="dark" layout="inline" />
            <p className="mt-3 text-sm leading-relaxed text-on-dark-faint">
              {siteConfig.newsletter.magnet}
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-3xl border border-dark-border-2"
          />
          <JourneyPanel subscriberCount={subscriberCount} />
        </div>
      </Container>
    </GlowSection>
  );
}
