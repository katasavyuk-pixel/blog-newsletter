import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Card } from "@/components/ui/card";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
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
    "Plantillas y prompts descargables que uso en mi negocio: el prompt de auditoría GEO y la plantilla de datos de emails logísticos.",
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
            Lo que uso en mi negocio, en formato que puedes abrir y copiar. Te
            los mando por correo: es una sola lista y te das de baja en un clic.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            ¿Buscabas la calculadora de costes de IA? Se usa entera y sin dejar
            nada, dentro de{" "}
            <Link
              href="/blog/cuanto-cuesta-la-ia"
              className="text-accent-ink hover:underline"
            >
              su artículo
            </Link>
            .
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

      {resources.length > 0 ? (
        <ScrollReveal variant="blur">
          <section className="mt-14" aria-labelledby="descargables">
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

      {/* The calculator used to sit above the downloads and was always on the
          page, so an empty resource list still rendered something. Now that it
          lives in its own article, a failed read from Supabase would leave the
          page every visitor from the video lands on with nothing on it. Say so
          and give them a person, rather than an empty shelf that reads as "he
          has nothing". */}
      {resources.length === 0 ? (
        <Card className="mt-14 max-w-2xl border-accent-ink/40">
          <h2 className="font-display text-lg font-semibold text-fg">
            No puedo cargar los descargables ahora mismo
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Es un fallo mío, no tuyo. Escríbeme a{" "}
            <a
              href={`mailto:${siteConfig.replyEmail}`}
              className="text-accent-ink underline"
            >
              {siteConfig.replyEmail}
            </a>{" "}
            diciéndome cuál querías y te lo mando yo mismo, hoy.
          </p>
        </Card>
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
            {/* This used to carry a third form ("Avísame"), which is the same
                signup into the same list as the two cards above it — a page
                asking for one address three times is what made the funnel read
                as email-hungry. Anyone who took either resource is already
                subscribed, so the sentence does the job the form was doing. */}
            <p className="mt-6 text-sm text-muted">
              Cuando alguno esté publicado lo cuento en la newsletter. Si te has
              llevado cualquiera de los recursos de arriba, ya estás en ella.
            </p>
          </section>
        </ScrollReveal>
      ) : null}
    </Container>
  );
}
