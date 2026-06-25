import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/** Saturated coral panel — the visual climax. Dark + ghost CTAs on coral. */
export function FinalCta() {
  return (
    <section className="bg-bg pb-16 sm:pb-24">
      <Container size="wide">
        <div className="relative isolate overflow-hidden rounded-3xl bg-accent px-7 py-16 sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(600px 300px at 90% -10%, rgba(255, 255, 255, 0.18), transparent 60%)",
            }}
          />
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium text-on-accent sm:text-5xl">
              Empieza hoy a entender la IA de verdad.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-coral-soft">
              Suscríbete a la newsletter o explora los artículos interactivos.
              Sin humo, paso a paso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/#newsletter" variant="dark-solid" size="lg">
                Suscríbete gratis
              </Button>
              <Button href="/blog" variant="ghost-coral" size="lg">
                Explora el blog
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
