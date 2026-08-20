import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Card } from "@/components/ui/card";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { CostCalculator } from "@/components/mdx/widgets/cost-calculator";
import { getPublishedResources } from "@/lib/resources";
import { LIBRARY_ITEMS, libraryStatus } from "@/config/library";
import { evidenciaLabel } from "@/lib/evidence";
import { siteConfig } from "@/config/site";

// The resource list comes from Supabase and must reflect the DB on every request.
// Without this the route prerenders at build time: `getPublishedResources()` bails
// out to [] when the Supabase envs are missing, so it never reaches `cookies()` and
// nothing opts the segment out of static rendering — the empty state gets baked in.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Calculadora de costes de IA y plantillas descargables. Se usan sin registro; el email solo si quieres que te las mande por escrito.",
  alternates: { canonical: "/recursos" },
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ need_email?: string; error?: string; slug?: string }>;
}) {
  const [resources, sp] = await Promise.all([
    getPublishedResources(),
    searchParams,
  ]);

  // /api/download bounces here when a download needs a confirmed email. Until
  // now the parameter was ignored and the reader landed on a page that said
  // nothing about why they had been moved — a dead end that reads as a bug.
  const blocked = sp.need_email
    ? resources.find((r) => r.slug === sp.need_email)
    : undefined;

  // /api/download also bounces here when the row is published but Storage has
  // no object behind it. The reader did everything right and still has nothing,
  // so the one thing this page must not do is act as if they had not asked.
  const roto =
    sp.error === "descarga"
      ? (resources.find((r) => r.slug === sp.slug)?.title ?? "el archivo")
      : undefined;

  // Derived, not hand-written: `assertEvidencia` fails the build when an ETA
  // expires, so this list cannot quietly become a set of stale promises, and it
  // cannot contradict the same items on /sistemas.
  const enPreparacion = LIBRARY_ITEMS.filter(
    (item) => libraryStatus(item) === "en-construccion",
  );

  return (
    <Container className="py-16">
      <ScrollReveal variant="blur">
        <header className="max-w-2xl">
          <h1 className="headline text-4xl text-fg sm:text-5xl">
            Herramientas que puedes usar hoy
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Lo que uso para decidir en mi negocio, en formato que puedes abrir y
            copiar. Se usan enteras sin registrarte. El email solo si quieres
            que te mande el resultado por escrito.
          </p>
        </header>
      </ScrollReveal>

      {roto ? (
        <Card className="mt-10 max-w-2xl border-accent-ink/40">
          <h2 className="font-display text-lg font-semibold text-fg">
            No he podido servirte «{roto}»
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tu dirección está confirmada y el enlace era correcto: el fallo está
            en mi lado, al ir a buscar el archivo. Escríbeme a{" "}
            <a
              href={`mailto:${siteConfig.replyEmail}`}
              className="text-accent-ink underline"
            >
              {siteConfig.replyEmail}
            </a>{" "}
            y te lo mando yo mismo, hoy.
          </p>
        </Card>
      ) : null}

      {blocked ? (
        <Card className="mt-10 max-w-2xl border-accent-ink/40">
          <h2 className="font-display text-lg font-semibold text-fg">
            Confirma tu email para bajar «{blocked.title}»
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            El enlace es válido, pero necesito una dirección confirmada antes de
            servir el archivo. Déjala aquí y te llega en un minuto.
          </p>
          <div className="mt-5">
            <SubscribeForm source="recursos" resource={blocked.slug} />
          </div>
        </Card>
      ) : null}

      <ScrollReveal variant="blur">
        <section className="mt-14" aria-labelledby="calculadora">
          <p className="font-mono text-xs uppercase tracking-wider text-accent-ink">
            Recurso 1 · Calculadora
          </p>
          <h2
            id="calculadora"
            className="mt-2 font-display text-2xl font-semibold text-fg"
          >
            ¿Cuánto te cuesta de verdad usar IA?
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Mueve el modelo, el tamaño de las peticiones y el volumen, y mira
            qué pasa con la factura. Es la misma calculadora del artículo, con
            los precios públicos de los cuatro modelos que más se usan.
          </p>
          <div className="mt-2 max-w-3xl">
            <CostCalculator captureMode />
          </div>
        </section>
      </ScrollReveal>

      {resources.length > 0 ? (
        <ScrollReveal variant="blur">
          <section className="mt-16" aria-labelledby="descargables">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-ink">
              Descargables
            </p>
            <h2
              id="descargables"
              className="mt-2 font-display text-2xl font-semibold text-fg"
            >
              Para llevarte y usar en tu operativa
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {resources.map((resource) => (
                <Card key={resource.id} className="flex h-full flex-col">
                  <h3 className="font-display text-xl font-semibold text-fg">
                    {resource.title}
                  </h3>
                  {resource.description ? (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {resource.description}
                    </p>
                  ) : null}
                  {resource.slug === "maitreai-geo" ? (
                    <Link
                      href="/blog/maitreai-geo"
                      className="mt-4 inline-block text-sm font-medium text-accent-ink hover:underline"
                    >
                      Ver el artículo y el vídeo del episodio →
                    </Link>
                  ) : null}
                  <div className="mt-5">
                    <SubscribeForm
                      source="recursos"
                      resource={resource.slug}
                      submitLabel="Enviármelo"
                      doneMessage="Hecho. Confirma en tu correo y te llega el enlace de descarga."
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {enPreparacion.length > 0 ? (
        <ScrollReveal variant="blur">
          <section className="mt-16 max-w-3xl" aria-labelledby="en-preparacion">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-ink">
              En el taller
            </p>
            <h2
              id="en-preparacion"
              className="mt-2 font-display text-2xl font-semibold text-fg"
            >
              Lo que estoy construyendo ahora
            </h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {enPreparacion.map((item) => (
                <li key={item.id} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-fg">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-faint">
                      {evidenciaLabel(item.evidencia)}
                    </span>
                  </div>
                  {item.blurb ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.blurb}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-sm text-muted">
                Te aviso cuando cualquiera de estos esté publicado.
              </p>
              <div className="mt-3 max-w-md">
                <SubscribeForm source="recursos-aviso" submitLabel="Avísame" />
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}
    </Container>
  );
}
