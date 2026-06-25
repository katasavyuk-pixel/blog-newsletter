import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { getPublishedResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Recursos gratuitos",
  description:
    "Guías y plantillas sobre inteligencia artificial. Te las envío a cambio de tu email.",
  alternates: { canonical: "/recursos" },
};

export default async function ResourcesPage() {
  const resources = await getPublishedResources();

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Recursos gratuitos
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Guías y plantillas sobre IA. Te las envío a cambio de tu email — con
          confirmación, sin spam.
        </p>
      </header>

      {resources.length === 0 ? (
        <Card className="mt-10 max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-fg">
            Pronto habrá recursos aquí
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Estoy preparando las primeras guías. Suscríbete y te aviso en cuanto
            publique la primera.
          </p>
          <div className="mt-5">
            <SubscribeForm source="recursos" />
          </div>
        </Card>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex h-full flex-col">
              <h2 className="font-display text-xl font-semibold text-fg">
                {resource.title}
              </h2>
              {resource.description ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {resource.description}
                </p>
              ) : null}
              <div className="mt-5">
                <SubscribeForm source="recursos" resource={resource.slug} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
