/**
 * Copy for the in-body subscription call to action.
 *
 * Resolution order: what the article declares in its frontmatter → a fallback per
 * `formato` → a last-resort default. The per-format fallback exists so an article
 * that never sets `cta_inline` still says something specific: a generic
 * "suscríbete a la newsletter" in the middle of a lesson is an interruption with
 * nothing offered in return, which is worse than no form at all.
 *
 * The promise has to be one this site keeps. `siteConfig.newsletter` is the
 * baseline claim and is checked elsewhere; anything added here must stay true
 * without a new deliverable behind it.
 */

import type { Post } from "@/lib/posts";

export type CtaInline = { gancho: string; promesa: string };

const POR_FORMATO: Record<string, CtaInline> = {
  leccion: {
    gancho: "Esto es una de seis lecciones",
    promesa:
      "Te aviso cuando publique la siguiente, y te llega cada sistema nuevo con lo que costó de verdad.",
  },
  sistema: {
    gancho: "Este sistema funciona en mi negocio ahora mismo",
    promesa:
      "Cada dos semanas te mando el siguiente: qué monté, cómo, y los números reales.",
  },
  caso: {
    gancho: "Los casos que salen bien y los que no",
    promesa:
      "Te mando el próximo con sus números, incluido lo que no funcionó.",
  },
  radar: {
    gancho: "El Radar sale de un sistema, no de un becario",
    promesa:
      "Si te interesa cómo está montado, te mando los sistemas que publico con su coste.",
  },
  herramienta: {
    gancho: "Más herramientas como esta",
    promesa: "Te aviso cuando publique la siguiente, sin más correos de por medio.",
  },
  nota: {
    gancho: "Sistemas replicables, cada dos semanas",
    promesa: "Qué monté, cómo, y lo que costó. Nada más.",
  },
};

const POR_DEFECTO: CtaInline = {
  gancho: "Sistemas replicables, cada dos semanas",
  promesa:
    "Un sistema que ya funciona en mi negocio, con lo que costó de verdad. Y cuando algo falla, también.",
};

export function ctaInlineFor(post: Post): CtaInline {
  return post.cta_inline ?? POR_FORMATO[post.formato] ?? POR_DEFECTO;
}
