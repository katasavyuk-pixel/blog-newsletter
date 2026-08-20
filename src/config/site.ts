/**
 * Single source of truth for the site's textual identity (brief §1).
 *
 * The whole site reads from here — this is the only file you edit to set
 * name / domain / bio / socials. Kept i18n-ready: text lives in config, not
 * hardcoded in components.
 *
 * Positioning (redesign 2026-07-22, see docs/superpowers/specs/): building
 * NBI — my own business — in public; reader #1 is a working entrepreneur; the
 * promise is replicable systems proven in a real business.
 *
 * That used to read "NBI (an AI company)", sixteen lines above the comment
 * that forbids exactly that wording. QUE_PUEDO_DECIR.md rules out claiming a
 * legal personality that does not exist yet, and a rule contradicted inside
 * its own file is a rule that will be broken by whoever reads the top first.
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
  // "mi negocio", never "una empresa": QUE_PUEDO_DECIR.md forbids claiming a
  // legal personality that does not exist yet, and this is the wording
  // ESTRATEGIA.md uses for the same thing. Revisit when the alta resolves.
  description:
    "Construyo mi negocio de soluciones de IA en público. Blog y newsletter para emprendedores en marcha: sistemas replicables, plantillas y formación interactiva probados en un negocio real.",
  /** Primary content language. */
  locale: "es",
  /**
   * Contact inbox for the privacy policy / data requests.
   *
   * Still unconfirmed as a monitored mailbox. That matters more than a TODO
   * suggests: the privacy policy names this address as the channel for GDPR
   * rights requests, so an alias nobody reads is a published commitment that
   * is not being met.
   */
  contactEmail: "privacidad@ianexora.com",
  /**
   * Public address for "just reply and tell me". Same mailbox as RESEND_REPLY_TO,
   * which is a server env and therefore unusable in a mailto: link.
   *
   * Deliberately not `contactEmail` — that one is the privacy/data-rights inbox,
   * and routing "tell me about your process" there mixes a legal channel with a
   * conversational one.
   *
   * Verified end to end on 2026-08-05: Kata replied to a sequence email and it
   * arrived. Reply rate is the metric for this phase, so this link and the
   * sequence's "responde a este email" both rest on it.
   */
  replyEmail: "info@ianexora.com",
  /** §1 AUDIENCIA — reader #1: entrepreneurs already running something. */
  audience: "emprendedores en marcha",
  author: {
    /** §1 TU_NOMBRE */
    name: "Kata Ivanovych",
    /** §1 TU_BIO_CORTA — identity in one line + credential + mission. */
    bio: "Construyo NBI, mi negocio de automatización con IA, y lo cuento en público: los sistemas que funcionan, los números reales y los errores. Si tienes un negocio en marcha, aquí te llevas lo que ya está probado. Sin humo.",
  },
  /** The public journey — anchors the "semana N" status panel and manifesto. */
  journey: {
    /** ISO date the public build started (first commit of this site). */
    start: "2026-06-24",
    /** Current mission, shown in the status panel. Update as it changes. */
    mission: "primeros clientes de NBI",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/katalin-savyuk-b024b7408/" },
    { label: "X", href: "https://x.com/Kata_malavie" },
    { label: "GitHub", href: "https://github.com/katasavyuk-pixel" },
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
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Primary navigation, ordered by how much each shelf carries the positioning.
 *
 * "Blog" is labelled "Artículos" because the Radar is also blog content, so the
 * generic name did not distinguish the archive from the site itself. Routes are
 * unchanged, so nothing indexed moves.
 *
 * Reordered 2026-08-05. Curso leads because it is the differentiating asset —
 * six interactive lessons, free, no account — and nothing else on the site is
 * hard to copy. Recursos moves up to second now that it carries a working
 * calculator and a real download; it used to sit fifth pointing at an empty
 * state. Sistemas drops to fourth: one of its five items is still "en el
 * taller", so the shelf is no longer half empty and the reason for the demotion
 * is nearly spent — it earns the position back when that last one ships.
 * (Said "two of its five" until 2026-08-21, by which point stack-geo had
 * shipped and the sentence was arguing for a layout on a fact that had changed.)
 *
 * Radar stays in the nav. Demoting it to the footer was considered and
 * rejected: it is the only thing on the site that demonstrably runs on its own,
 * and getRadarCadence() already degrades the claim when it stops.
 */
export const navLinks = [
  { label: "Curso", href: "/empieza-aqui" },
  { label: "Recursos", href: "/recursos" },
  { label: "Artículos", href: "/blog" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Radar", href: "/radar" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;
