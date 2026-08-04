import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { siteConfig } from "@/config/site";

/**
 * Author note — who I am, what I am building and why I give the systems away.
 * NBI appears as story, never as offer (it sells downstream, in the day-8
 * email). Carries the identity filter.
 *
 * Closes the page rather than opening it: a publication earns the "about me"
 * after showing the work, not before.
 *
 * The BrandVisual "KI" monogram that used to sit here is gone. It was a
 * placeholder standing in for a photograph, and a placeholder avatar reads as
 * unfinished rather than as design. A real photo can take this slot; until
 * there is one, the note carries itself.
 */
export function Manifesto() {
  return (
    <section className="bg-bg">
      <Container size="default" className="py-16 sm:py-24">
        <div className="max-w-2xl border-l-2 border-accent pl-6 sm:pl-8">
          <Eyebrow>El viaje</Eyebrow>
          <h2 className="mt-3 headline text-3xl text-fg sm:text-4xl">
            Construyo mi negocio. Tú te llevas los sistemas.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {siteConfig.author.bio}
          </p>
          <p className="mt-3 leading-relaxed text-muted">
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
      </Container>
    </section>
  );
}
