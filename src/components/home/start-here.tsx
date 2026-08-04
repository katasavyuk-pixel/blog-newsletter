import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { allPosts } from "@/lib/posts";

/**
 * Three named routes in, for a reader who has never been here.
 *
 * Not a showcase of "featured resources" — a decision. The question a first
 * visit actually asks is "where do I start", and a grid of everything is the
 * one answer that does not help. Each route says who it is for.
 *
 * Every entry is derived from real content, so none of them can point at
 * something that does not exist.
 */
export function StartHere() {
  // "Si ya ejecutas" should land on something built, not on a beginner lesson.
  // Falls back to the newest non-Radar piece while no sistema/caso is published
  // — which is the honest state today, and self-corrects the moment one ships.
  const latest =
    allPosts.find(
      (post) => post.formato === "sistema" || post.formato === "caso",
    ) ?? allPosts.find((post) => post.formato !== "radar");
  const latestRadar = allPosts.find((post) => post.formato === "radar");

  const routes = [
    {
      href: "/empieza-aqui",
      kicker: "Si empiezas de cero",
      title: "Entiende la IA tocándola",
      blurb:
        "Seis lecciones interactivas en orden. No lees cómo funciona: mueves los mandos y lo ves.",
    },
    latest && {
      href: latest.permalink,
      kicker: "Si ya ejecutas",
      title: latest.title,
      blurb: latest.dek ?? latest.description,
    },
    latestRadar && {
      href: latestRadar.permalink,
      kicker: "Si quieres ponerte al día",
      title: "Radar IA",
      blurb:
        "Los titulares de la semana filtrados y verificados contra su fuente, con por qué importan.",
    },
  ].filter((route): route is NonNullable<typeof route> => Boolean(route));

  if (routes.length === 0) return null;

  return (
    <section className="bg-bg">
      <Container size="wide" className="py-16 sm:py-24">
        <Eyebrow>Empieza aquí</Eyebrow>
        <h2 className="mt-3 headline text-3xl text-fg sm:text-4xl">
          Por dónde entrar
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {routes.map((route, i) => (
            <ScrollReveal key={route.href} delay={i * 0.07} className="h-full">
              <Link
                href={route.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
              >
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-accent-ink">
                  {route.kicker}
                </p>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                  {route.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {route.blurb}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
