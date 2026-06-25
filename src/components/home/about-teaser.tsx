import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BrandVisual } from "@/components/ui/brand-visual";
import { siteConfig } from "@/config/site";

/** Light two-column "about" teaser — brand avatar + bio, links to /sobre-mi. */
export function AboutTeaser() {
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
            <Eyebrow>Sobre mí</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Soy {siteConfig.author.name}.
            </h2>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
              {siteConfig.author.bio}
            </p>
            <div className="mt-7">
              <Button href="/sobre-mi" variant="secondary">
                Conoce mi enfoque →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
