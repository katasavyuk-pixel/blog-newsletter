import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { JsonLd } from "@/components/ui/json-ld";
import { faqJsonLd } from "@/lib/jsonld";
import { sentIssues } from "@/lib/newsletter-archive";
import { siteConfig } from "@/config/site";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `${siteConfig.newsletter.description} Aquí están las ediciones ya enviadas, en versión web.`,
  alternates: { canonical: "/newsletter" },
};

/**
 * Questions people actually ask about a newsletter, answered with facts the
 * site already stands behind — cadence (what the welcome sequence states),
 * price (free, no fine print), unsubscribing (one click, RFC 8058), and why
 * the archive is incomplete by design. Visible block AND FAQPage schema say
 * the same words: the checklist in docs/geo-checklist.md forbids marking up
 * anything a reader cannot see on the page.
 */
const NEWSLETTER_FAQ = [
  {
    q: "¿Cada cuánto sale la newsletter?",
    a: "Cada dos semanas. Cada edición cuenta un sistema que funciona en el negocio de Kata — qué construyó, cómo y los números reales — y llega antes a los suscriptores que a este archivo.",
  },
  {
    q: "¿Cuesta algo suscribirse?",
    a: "No. Es gratis y sin letra pequeña: un email cada dos semanas, el curso interactivo y los recursos nuevos antes que nadie. Puedes darte de baja en cualquier momento.",
  },
  {
    q: "¿Cómo me doy de baja?",
    a: "Con un clic en el enlace de baja que lleva cada email, abajo. La baja es inmediata y no pide confirmación ni razones: dejas de recibir todo. Si algún día quieres volver, suscribirte de nuevo funciona igual.",
  },
  {
    q: "¿Por qué no están todas las ediciones?",
    a: "El archivo solo publica ediciones ya enviadas a los suscriptores, la misma semana que salen. Quien se apunta recibe cada edición antes que nadie — ese es el trato.",
  },
] as const;

/**
 * The public web archive of the newsletter.
 *
 * An indexable archive on our own domain does three jobs a private list
 * cannot: it is the social proof a subscribe form needs ("look at what you
 * get"), it lets a sent edition keep earning readers through search and
 * shares, and it gives new arrivals a taste without asking for an email
 * first — the same "give before you ask" order the home argues for.
 *
 * Only issues with `sent: true` appear — subscribers are promised each
 * edition "antes que nadie", so approved-but-unsent issues stay private.
 * The gate lives in `src/lib/newsletter-archive.ts`, not here: no surface
 * can bypass it by forgetting a filter.
 */
export default function NewsletterArchivePage() {
  const issues = sentIssues;

  return (
    <Container className="py-16">
      {/* The FAQ is on the page and in the schema with the same words — the
          first real caller of faqJsonLd(), which waited since 2026-08-05 for
          an honest question block instead of structured spam. */}
      <JsonLd data={faqJsonLd([...NEWSLETTER_FAQ])} />
      <ScrollReveal variant="blur">
        <header className="max-w-2xl">
          <Eyebrow>Newsletter</Eyebrow>
          <h1 className="headline mt-3 text-4xl text-fg sm:text-5xl">
            Las ediciones, en la web
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {siteConfig.newsletter.description} Los suscriptores las reciben
            antes que nadie; aquí quedan archivadas para quien llegue después.
          </p>
          {/* Archive bottom-up: the list is the proof, the form is what the
              proof argues for. One form on the page, at the end of the argument. */}
          <p className="mt-6 max-w-xl">
            <Link
              href="#suscribirse"
              className="font-mono text-sm text-accent-ink transition-colors hover:text-fg"
            >
              ▸ Recibirlas antes que nadie
            </Link>
          </p>
        </header>
      </ScrollReveal>

      {issues.length > 0 ? (
        <ScrollReveal variant="blur" className="mt-14">
          <section aria-labelledby="ediciones-newsletter">
            <h2
              id="ediciones-newsletter"
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink"
            >
              Ediciones enviadas
            </h2>
            <ul className="mt-4 border-t border-border">
              {issues.map((issue) => (
                <li key={issue.issue}>
                  <Link
                    href={issue.permalink}
                    className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-border py-4 transition-colors hover:border-accent sm:grid-cols-[6rem_1fr]"
                  >
                    <time
                      dateTime={issue.date}
                      className="font-mono text-xs tabular-nums text-faint"
                    >
                      {formatDateShort(issue.date)}
                    </time>
                    <span className="min-w-0">
                      <h3 className="font-display text-base font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                        {issue.title}
                      </h3>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {issue.preheader}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      ) : (
        <ScrollReveal variant="blur" className="mt-14">
          <section
            aria-labelledby="proximamente-newsletter"
            className="max-w-2xl rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <h2
              id="proximamente-newsletter"
              className="font-mono text-xs uppercase tracking-[0.15em] text-accent-ink"
            >
              Aún no hay ediciones archivadas
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              La primera va camino de los buzones. Aquí quedará en cuanto se
              envíe — pero suscribirte sigue siendo la única forma de leerla{" "}
              <strong className="text-fg">antes que nadie</strong>.
            </p>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal variant="blur" className="mt-14">
        <section
          aria-labelledby="preguntas-newsletter"
          className="max-w-2xl scroll-mt-20"
        >
          <h2
            id="preguntas-newsletter"
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink"
          >
            Preguntas frecuentes
          </h2>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {NEWSLETTER_FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="font-display text-base font-medium text-fg">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="blur" className="mt-14">
        <section
          id="suscribirse"
          aria-labelledby="suscribirse-titulo"
          className="max-w-2xl scroll-mt-20 rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="suscribirse-titulo"
            className="font-display text-xl font-medium text-fg"
          >
            Recibir las ediciones
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {siteConfig.newsletter.magnet}
          </p>
          <div className="mt-5">
            <SubscribeForm source="newsletter-archive" />
          </div>
        </section>
      </ScrollReveal>
    </Container>
  );
}
