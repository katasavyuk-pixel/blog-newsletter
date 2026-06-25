import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowSection } from "@/components/ui/glow-section";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { siteConfig } from "@/config/site";

/** Dark, glowing newsletter section — value-prop checklist + a real opt-in form card. */
export function NewsletterCta() {
  return (
    <GlowSection id="newsletter">
      <Container
        size="wide"
        className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2"
      >
        <div className="max-w-xl">
          <Eyebrow tone="dark">La newsletter</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium text-on-dark sm:text-5xl">
            Ideas de IA que sí puedes aplicar
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-on-dark-muted">
            {siteConfig.newsletter.description}
          </p>
          <ul className="mt-7 flex flex-col gap-3">
            {siteConfig.newsletter.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-on-accent"
                >
                  ✓
                </span>
                <span className="text-on-dark-muted">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dark-border-2 bg-white/5 p-7 sm:p-8">
          <h3 className="font-display text-2xl font-medium text-on-dark">
            Suscríbete gratis
          </h3>
          <p className="mt-1 font-mono text-xs text-on-dark-faint">
            Cero ruido · cancela cuando quieras
          </p>
          <div className="mt-5">
            <SubscribeForm source="home" tone="dark" layout="stacked" />
          </div>
        </div>
      </Container>
    </GlowSection>
  );
}
