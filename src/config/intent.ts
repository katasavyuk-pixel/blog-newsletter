/**
 * Entry wizard — the single source of truth for the first-visit intent router.
 *
 * This is the only file you edit to change what the one-time onboarding asks or
 * where each answer routes. Content stays behind QUE_PUEDO_DECIR.md: the hints
 * here reuse positioning already public on the site, they do not invent claims.
 *
 * Storage key is namespaced per build of the wizard so a change to these steps
 * re-introduces it without anyone having to clear site data.
 */

/** First question: the visitor's intent → where they get routed. */
export type IntentOption = {
  id: string;
  /** Short option label (card title, Anton). */
  label: string;
  /** One-line hint; honest, specific, no promises. */
  hint: string;
  /** Where choosing this routes the visitor. */
  route: string;
};

export const INTENT_OPTIONS: IntentOption[] = [
  {
    id: "aprender",
    label: "Estoy empezando",
    hint: "El curso interactivo de IA, sin cuenta y sin pago.",
    route: "/empieza-aqui",
  },
  {
    id: "sistemas",
    label: "Quiero resultados",
    hint: "Sistemas que monté en mi negocio, cada uno con su factura.",
    route: "/sistemas",
  },
  {
    id: "actualidad",
    label: "Seguir el pulso",
    hint: "IA, tecnología, empresas y geopolítica, verificado cada semana.",
    route: "/radar",
  },
  {
    id: "colaborar",
    label: "Quiero montar algo",
    hint: "Recursos descargables y cómo trabajamos con la IA de tu negocio.",
    route: "/trabaja-con-nbi",
  },
];

/** Second question: reading preference. Stored, not routed — it only personalises the closing copy. */
export type FormaOption = {
  id: string;
  label: string;
  hint: string;
};

export const FORMA_OPTIONS: FormaOption[] = [
  { id: "leer", label: "Leer", hint: "Análisis y plantillas" },
  { id: "ver", label: "Ver", hint: "Vídeo y pantallas reales" },
  { id: "mixto", label: "Mixto", hint: "Las dos cosas" },
];

/**
 * The site's mascot — a little AI guide that welcomes you and walks you in.
 * It is an in-fiction helper of this site's own making (Kata Ivanovych), not a
 * real assistant: keep the copy third-person and playful, never promise what an
 * AI could not do here (see QUE_PUEDO_DECIR.md — it still talks about what the
 * site actually offers).
 */
export const MASCOT = {
  name: "Chispa",
  /** One short line per wizard step the guide says before the question. */
  lines: {
    intro: "Soy Chispa, tu último fichaje. Te guío un segundo…",
    intencion: "¿Qué te trae hoy?",
    forma: "¿Prefieres leer, ver… o el lío de siempre?",
    rumbo: "Listo. Rumbo a tu elección.",
  } as const,
};

/** Copres for the third step, keyed by the visitor's intent and reading preference. */
export const RUMBO_COPY: Record<IntentOption["id"], string> = {
  aprender: "Empezamos por el curso",
  sistemas: "A por el catálogo de sistemas",
  actualidad: "Abrimos el radar de la semana",
  colaborar: "Suerte con el negocio",
};

/**
 * There is deliberately no email step here.
 *
 * The wizard used to ask for one before the visitor had read a line. That is the
 * same landing-page reflex that got the capture form removed from the masthead:
 * this site does not ask for an address before it has given anything. Capture
 * lives where the reader has already been served — the article closing,
 * `/recursos` and the footer. Decision by Kata, 2026-08-06.
 */

/**
 * There is deliberately no storage key here either.
 *
 * The wizard no longer opens itself on arrival, so there is no "has this visitor
 * seen it" to persist: the only ways in are `?wizard=1` and Chispa offering it.
 * The reasoning is in `@/hooks/use-intent-wizard`. Decision by Kata, 2026-08-06.
 */