/**
 * Single source of truth for the site's textual identity (brief §1).
 *
 * The whole site reads from here — this is the only file you edit to set
 * name / domain / bio / socials. Kept i18n-ready: text lives in config, not
 * hardcoded in components.
 *
 * AJUSTA si procede: `domain`/`url` (tu dominio real) y `social` (tus perfiles).
 * `author.bio` es un borrador neutro — personalízalo cuando quieras.
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
  tagline: "Aprende a aplicar IA de verdad, sin humo.",
  /** Default meta description (1–2 sentences). */
  description:
    "Blog y newsletter sobre inteligencia artificial: artículos, recursos gratuitos y formación práctica para entender y aplicar la IA en tu día a día.",
  /** Primary content language. */
  locale: "es",
  /** Contact inbox for the privacy policy / data requests. TODO: confirma que es un buzón real (alias en ianexora.com). */
  contactEmail: "privacidad@ianexora.com",
  /** §1 AUDIENCIA — mixed: devs + businesses + curious (leveled via tags). */
  audience: "mixta",
  author: {
    /** §1 TU_NOMBRE */
    name: "Kata Ivanovych",
    /** §1 TU_BIO_CORTA — draft neutro, personalízalo. */
    bio: "Ayudo a personas y equipos a entender y aplicar la inteligencia artificial sin humo. Aquí comparto artículos, recursos y formación práctica: lo que funciona, lo que no, y cómo empezar hoy.",
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
      "Ideas prácticas sobre IA, sin ruido. Un email cuando hay algo que merece la pena.",
    cta: "Suscribirme",
    /** Value-prop checklist shown next to the home capture form (honest, no metrics). */
    bullets: [
      "Una idea práctica sobre IA que puedes aplicar, sin relleno.",
      "Lo que funciona y lo que no, explicado en claro.",
      "Recursos y artículos interactivos para tocar y entender.",
    ],
  },
  /** Top-of-site announcement bar (set to "" to hide). */
  announcement:
    "Nuevo: artículos interactivos sobre IA — toca, ajusta y entiende cómo funciona",
} as const;

export type SiteConfig = typeof siteConfig;

/** Primary navigation. Routes are built in their phases (Blog/Recursos → Fase 1/2). */
export const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Recursos", href: "/recursos" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;
