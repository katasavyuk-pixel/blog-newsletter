import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BrandVisual } from "@/components/ui/brand-visual";
import { siteConfig } from "@/config/site";

/**
 * The journey manifesto — who I am, what I'm building and why I give the
 * systems away. NBI appears as story, never as offer (high-ticket sells
 * downstream, day-8 email). Includes the identity filter.
 */
export function Manifesto() {
  return (
    <section className="bg-bg">
      <Container size="default" className="py-16 sm:py-24">
        <div className="grid items-center gap-10 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-14">
          <BrandVisual
            label="KI"
            rounded="rounded-3xl"
            labelClassName="text-6xl"
            className="mx-auto aspect-square w-full max-w-xs"
          />
          <div>
            <Eyebrow>El viaje</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Construyo una empresa. Tú te llevas los sistemas.
            </h2>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
              {siteConfig.author.bio}
            </p>
            <p className="mt-3 max-w-prose leading-relaxed text-muted">
              ¿Por qué regalarlos? Porque documentar lo que funciona me obliga a
              construir mejor, y porque un sistema solo se entiende del todo
              cuando otro lo replica.{" "}
              <strong className="font-semibold text-fg">
                Esto te encantará si ejecutas; no encajarás si buscas atajos.
              </strong>
            </p>
            <div className="mt-7">
              <Button href="/sobre-mi" variant="secondary">
                La historia completa →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
