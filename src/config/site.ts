/**
 * Single source of truth for the site's textual identity (brief §1).
 *
 * The whole site reads from here — this is the only file you edit to set
 * name / domain / bio / socials. Kept i18n-ready: text lives in config, not
 * hardcoded in components.
 *
 * Positioning (redesign 2026-07-22, see docs/superpowers/specs/): building
 * NBI (an AI company) in public; reader #1 is a working entrepreneur; the
 * promise is replicable systems proven in a real business.
 */

export type SocialLink = { label: string; href: string };

export const siteConfig = {
  /** §1 NOMBRE_MARCA — marca personal = tu nombre. */
  name: "Kata Ivanovych",
  /** §1 DOMINIO (without protocol) — subdominio del dominio NBI ianexora.com. */
  domain: "kata.ianexora.com",
  /** Absolute base URL — used for metadataBase / canonical / OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kata.ianexora.com",
  /** §1 TAGLINE — one line: what you promise and to whom. */
  tagline: "Sistemas probados en un negocio real. Llévatelos.",
  /** Default meta description (1–2 sentences). */
  description:
    "Estoy construyendo una empresa de IA en público. Blog y newsletter para emprendedores en marcha: sistemas replicables, plantillas y formación interactiva probados en un negocio real.",
  /** Primary content language. */
  locale: "es",
  /** Contact inbox for the privacy policy / data requests. TODO: confirma que es un buzón real (alias en ianexora.com). */
  contactEmail: "privacidad@ianexora.com",
  /** §1 AUDIENCIA — reader #1: entrepreneurs already running something. */
  audience: "emprendedores en marcha",
  author: {
    /** §1 TU_NOMBRE */
    name: "Kata Ivanovych",
    /** §1 TU_BIO_CORTA — identity in one line + credential + mission. */
    bio: "Estoy construyendo NBI, una empresa de automatización con IA, y lo cuento en público: los sistemas que funcionan, los números reales y los errores. Si tienes un negocio en marcha, aquí te llevas lo que ya está probado. Sin humo.",
  },
  /** The public journey — anchors the "semana N" status panel and manifesto. */
  journey: {
    /** ISO date the public build started (first commit of this site). */
    start: "2026-06-24",
    /** Current mission, shown in the status panel. Update as it changes. */
    mission: "primeros clientes de NBI",
  },
  /** §1 REDES — descomenta y pon tus perfiles reales. */
  social: [
    // { label: "LinkedIn", href: "https://linkedin.com/in/kata-ivanovych" },
    // { label: "X", href: "https://x.com/kataivanovych" },
    // { label: "GitHub", href: "https://github.com/kataivanovych" },
  ] as SocialLink[],
  /** Newsletter capture copy (the real form is wired in Fase 2). */
  newsletter: {
    title: "Suscríbete a la newsletter",
    description:
      "Cada sistema nuevo que funciona en mi negocio, contado para que lo repliques en el tuyo: qué construí, cómo, y los números de verdad.",
    cta: "Suscribirme",
    /** Named lead magnet shown next to the capture forms (honest: it's the welcome sequence). */
    magnet:
      "Al suscribirte: el itinerario del curso interactivo de IA y cada sistema nuevo antes que nadie.",
    /** Value-prop checklist shown next to the home capture form (honest, no metrics). */
    bullets: [
      "Un sistema replicable probado en mi negocio, con plantilla cuando la hay.",
      "Los números y errores reales del viaje: lo que funciona y lo que no.",
      "El curso interactivo de IA y cada recurso nuevo, antes que nadie.",
    ],
    /** Hide the subscriber count below this threshold (honest social proof only). */
    showCountFrom: 100,
  },
  /** Top-of-site announcement bar (set to "" to hide). */
  announcement:
    "Nuevo: la Biblioteca de Sistemas — lo que ya funciona en un negocio real, gratis",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Primary navigation — 4 items + CTA (redesign spec §arquitectura: content
 * first, About last). /blog and /recursos stay live but leave the nav; the
 * library links into both.
 */
export const navLinks = [
  { label: "Biblioteca", href: "/biblioteca" },
  { label: "Curso", href: "/empieza-aqui" },
  { label: "Noticias", href: "/blog/tag/radar" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;
