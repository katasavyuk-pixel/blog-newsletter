import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { CredibilityBadges } from "@/components/ui/credibility-badges";
import { siteConfig } from "@/config/site";
import { allPosts } from "@/lib/posts";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";
import { weekNumberSince } from "@/lib/format";

export const metadata: Metadata = {
  title: "El viaje",
  description: `Quién está detrás de ${siteConfig.name} y qué está construyendo en público.`,
  alternates: { canonical: "/sobre-mi" },
};

/**
 * "El viaje" — identity in one line, honest credential, mission, newsletter
 * CTA (Barry/Welsh about structure; never a chronological biography).
 */
export default async function AboutPage() {
  const count = await getConfirmedSubscriberCount();
  const subscriberCount =
    count != null && count >= siteConfig.newsletter.showCountFrom ? count : null;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <CredibilityBadges
          weekNumber={weekNumberSince(siteConfig.journey.start)}
          subscriberCount={subscriberCount}
          postCount={allPosts.length}
          className="mb-5"
        />
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
          <p>
            Si quieres que implemente algo parecido en tu negocio,{" "}
            <Link href="/trabaja-con-nbi" className="text-accent-ink">
              hablemos
            </Link>
            .
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
