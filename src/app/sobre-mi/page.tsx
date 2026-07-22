import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "El viaje",
  description: `Quién está detrás de ${siteConfig.name} y qué está construyendo en público.`,
  alternates: { canonical: "/sobre-mi" },
};

/**
 * "El viaje" — identity in one line, honest credential, mission, newsletter
 * CTA (Barry/Welsh about structure; never a chronological biography).
 */
export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          El viaje
        </h1>
        <Prose className="mt-6">
          <p>
            Soy {siteConfig.author.name}. {siteConfig.author.bio}
          </p>
          <p>
            No vendo el mapa de un territorio que no he pisado: cada sistema de
            la biblioteca sale de algo que implementé de verdad — en NBI o en
            este mismo blog — con sus números y sus errores. Documentarlo en
            público me obliga a construir mejor, y a ti te ahorra el camino
            equivocado.
          </p>
          <p>
            Esto te encantará si tienes un negocio en marcha y ejecutas. No
            encajarás si buscas atajos, fórmulas mágicas o humo motivacional:
            aquí solo hay lo que funciona, explicado para que lo repliques.
          </p>
        </Prose>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-fg">
            Sigue el viaje de cerca
          </h2>
          <p className="mt-1 text-sm text-muted">
            {siteConfig.newsletter.description}
          </p>
          <div className="mt-4">
            <SubscribeForm source="about" />
          </div>
        </div>
      </div>
    </Container>
  );
}
