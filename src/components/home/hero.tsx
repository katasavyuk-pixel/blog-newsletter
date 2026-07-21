import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowSection } from "@/components/ui/glow-section";
import { HeroTokenizer } from "@/components/home/hero-tokenizer";
import { allPosts, getPostsByTag } from "@/lib/posts";
import { siteConfig } from "@/config/site";

/** Dark, glowing two-column hero — tagline + CTAs left, a LIVE tokenizer right. */
export function Hero() {
  // Lab-console status line: real numbers, frozen at build time (static page).
  const latestRadar = getPostsByTag("radar")[0];
  const statusLines = [
    `${allPosts.length} artículos · ${getPostsByTag("interactivo").length} interactivos`,
    latestRadar ? `radar: edición ${latestRadar.date.slice(0, 10)} ✓` : null,
    "construido en público",
  ].filter(Boolean) as string[];

  return (
    <GlowSection fadeBottom>
      <Container
        size="wide"
        className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2"
      >
        <div className="max-w-xl">
          <Eyebrow tone="dark">IA explicada · interactiva · sin humo</Eyebrow>

          <h1
            className="mt-5 font-punch font-normal uppercase text-on-dark text-balance"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.0 }}
          >
            Aprende a aplicar IA de verdad,{" "}
            <span className="text-accent">sin humo.</span>
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

          <div className="mt-10 max-w-md rounded-xl border border-dark-border bg-dark-input/50 p-4 font-mono text-xs leading-relaxed text-on-dark-faint">
            <p className="text-on-dark-muted">
              <span className="text-salmon">$</span> kata --status
            </p>
            {statusLines.map((line) => (
              <p key={line}>
                <span aria-hidden className="text-salmon">
                  ▸{" "}
                </span>
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-3xl border border-dark-border-2"
          />
          <HeroTokenizer />
        </div>
      </Container>
    </GlowSection>
  );
}
