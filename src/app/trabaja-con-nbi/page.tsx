import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Trabaja con NBI",
  description:
    "¿Tienes un negocio en marcha y quieres implementar algo así? Cuéntame tu caso.",
  alternates: { canonical: "/trabaja-con-nbi" },
};

/**
 * Honest placeholder for NBI's service offer — no price or scope is claimed
 * here on purpose (Kata hasn't defined them yet). Fill in a concrete offer
 * (price, timeline, what's included) in the paragraph below once it exists;
 * until then this stays a plain "tell me your case" contact surface.
 */
export default function WorkWithNbiPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
          NBI
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Trabaja con NBI
        </h1>
        <Prose className="mt-6">
          <p>
            Estoy construyendo NBI en público: cada sistema del blog sale de
            algo que implementé de verdad, con sus números y sus errores. Si
            tienes un negocio en marcha y quieres que implemente algo parecido
            en el tuyo, hablemos.
          </p>
          <p>
            Cuéntame tu caso — qué proceso te está costando tiempo o dinero —
            y te digo si tiene sentido y por dónde empezaríamos.
          </p>
        </Prose>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-fg">
            Cuéntame tu caso
          </h2>
          <p className="mt-1 text-sm text-muted">
            Te respondo yo directamente, no un equipo comercial.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          También puedes escribir directamente a{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-accent-ink hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
