import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowSection } from "@/components/ui/glow-section";
import { BrandVisual } from "@/components/ui/brand-visual";
import { allPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import { siteConfig } from "@/config/site";

/** Dark, glowing two-column hero — tagline + CTAs on the left, brand visual on the right. */
export function Hero() {
  const stats = [
    { value: allPosts.length, label: "artículos" },
    { value: getPostsByTag("interactivo").length, label: "interactivos" },
    { value: getAllTags().length, label: "temas" },
  ];

  return (
    <GlowSection fadeBottom>
      <Container
        size="wide"
        className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2"
      >
        <div className="max-w-xl">
          <Eyebrow tone="dark">IA explicada · interactiva · sin humo</Eyebrow>

          <h1
            className="mt-5 font-display font-medium text-on-dark text-balance"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.04 }}
          >
            Aprende a aplicar IA{" "}
            <em className="italic text-salmon">de verdad, sin humo.</em>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted">
            {siteConfig.description} Aquí no solo lees cómo funciona la IA:{" "}
            <strong className="font-semibold text-on-dark">
              metes la mano y giras el mando
            </strong>
            .
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#newsletter" size="lg">
              Suscríbete gratis
            </Button>
            <Button href="/blog" variant="outline-dark" size="lg">
              Explora los artículos
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-on-dark-faint">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-on-dark">
                  <span className="text-base">{stat.value}</span> {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-3xl border border-dark-border-2"
          />
          <BrandVisual
            label="KI"
            caption="IA explicada, sin humo"
            labelClassName="text-7xl"
            className="relative aspect-[4/5] w-full"
          />
        </div>
      </Container>
    </GlowSection>
  );
}
