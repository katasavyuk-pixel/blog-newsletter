import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: `Quién está detrás de ${siteConfig.name}.`,
  alternates: { canonical: "/sobre-mi" },
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Sobre mí
        </h1>
        <Prose className="mt-6">
          <p>{siteConfig.author.bio}</p>
          <p>
            En este blog comparto lo que aprendo aplicando inteligencia artificial a
            problemas reales: lo que funciona, lo que no, y cómo empezar. Si quieres
            recibir lo nuevo, suscríbete abajo.
          </p>
        </Prose>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-fg">
            {siteConfig.newsletter.title}
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
