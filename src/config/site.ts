/**
 * Single source of truth for the site's textual identity (brief §1).
 *
 * TODO(katamv): fill these with the real values. The whole site reads from
 * here, so this is the only file you edit to set name / domain / bio / socials.
 * Kept i18n-ready: text lives in config, not hardcoded in components.
 */

export type SocialLink = { label: string; href: string };

export const siteConfig = {
  /** §1 NOMBRE_MARCA */
  name: "TODO_NOMBRE_MARCA",
  /** §1 DOMINIO (without protocol) */
  domain: "tudominio.com",
  /** Absolute base URL — used for metadataBase / canonical / OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tudominio.com",
  /** §1 TAGLINE — one line: what you promise and to whom. */
  tagline: "Aprende a aplicar IA de verdad, sin humo.",
  /** Default meta description (1–2 sentences). */
  description:
    "Blog y newsletter sobre inteligencia artificial: artículos, recursos gratuitos y formación práctica para entender y aplicar la IA.",
  /** Primary content language. */
  locale: "es",
  /** §1 AUDIENCIA — mixed: devs + businesses + curious (leveled via tags). */
  audience: "mixta",
  author: {
    /** §1 TU_NOMBRE */
    name: "TODO_TU_NOMBRE",
    /** §1 TU_BIO_CORTA — 2–3 sentences for "Sobre mí" and post authorship. */
    bio: "TODO: 2-3 frases sobre ti para la página 'Sobre mí' y la autoría de los artículos.",
  },
  /** §1 REDES — uncomment / fill with your real profiles. */
  social: [
    // { label: "LinkedIn", href: "https://linkedin.com/in/tu-perfil" },
    // { label: "X", href: "https://x.com/tu-perfil" },
    // { label: "GitHub", href: "https://github.com/tu-perfil" },
  ] as SocialLink[],
  /** Newsletter capture copy (the real form is wired in Fase 2). */
  newsletter: {
    title: "Suscríbete a la newsletter",
    description:
      "Ideas prácticas sobre IA, sin ruido. Un email cuando hay algo que merece la pena.",
    cta: "Suscribirme",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Primary navigation. Routes are built in their phases (Blog/Recursos → Fase 1/2). */
export const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Recursos", href: "/recursos" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;
