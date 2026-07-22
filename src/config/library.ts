/**
 * "Biblioteca de Sistemas" — SSOT for every deliverable the site gives away
 * (redesign 2026-07-22, see docs/superpowers/specs/). Follows the course.ts
 * pattern: plain config, hydrated at build time by the components.
 *
 * Honesty rule: every item must be real. `status: "disponible"` links to a
 * live deliverable; `"en-construccion"` announces work actually happening in
 * NBI (the "announced gaps" that turn scarcity into anticipation).
 */

export type ChipColor = "coral" | "navy" | "toffee" | "forest";

export type LibraryTheme = "ia-aplicada" | "captacion" | "contenido";

/** Display labels for the /biblioteca theme blocks, in page order. */
export const LIBRARY_THEMES: Record<LibraryTheme, string> = {
  "ia-aplicada": "IA aplicada",
  captacion: "Captación y embudo",
  contenido: "Contenido en automático",
};

export type LibraryItem = {
  id: string;
  status: "disponible" | "en-construccion";
  /** When set, title/blurb/href hydrate from the post with this slug. */
  slug?: string;
  title?: string;
  blurb?: string;
  href?: string;
  tema: LibraryTheme;
  color: ChipColor;
  glyph: string;
  /** Deliverable format shown as a badge (Curso interactivo, Calculadora…). */
  format: string;
  /** Honest proof line ("en producción · cada lunes"). */
  proof?: string;
  /** 0–100, only meaningful for "en-construccion" cards. */
  progress?: number;
  /** The library pillar — rendered as the big course block on the home. */
  featured?: boolean;
};

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: "curso-ia",
    status: "disponible",
    title: "Entiende la IA tocándola",
    blurb:
      "Seis lecciones interactivas, de los tokens a la vida completa de un prompt. No lees cómo funciona la IA: la manipulas. Tu progreso se guarda solo.",
    href: "/empieza-aqui",
    tema: "ia-aplicada",
    color: "coral",
    glyph: "▦",
    format: "Curso interactivo",
    proof: "6 lecciones · gratis · sin registro",
    featured: true,
  },
  {
    id: "calculadora-costes",
    status: "disponible",
    slug: "cuanto-cuesta-la-ia",
    tema: "ia-aplicada",
    color: "forest",
    glyph: "€",
    format: "Calculadora",
    proof: "herramienta en vivo · 0 coste de API",
  },
  {
    id: "radar-automatico",
    status: "disponible",
    title: "Radar IA en automático",
    blurb:
      "Noticias de IA filtradas y verificadas cada lunes, generadas por un pipeline anti-alucinación con checkpoint humano. Funciona en producción en este mismo blog.",
    href: "/blog/tag/radar",
    tema: "contenido",
    color: "navy",
    glyph: "◉",
    format: "Sistema en producción",
    proof: "en producción · cada lunes",
  },
  {
    id: "stack-geo",
    status: "en-construccion",
    title: "Stack GEO: que la IA recomiende tu negocio",
    blurb:
      "Que ChatGPT y compañía encuentren y citen tu web: llms.txt, datos estructurados y el porqué de cada pieza. Vídeo + guía replicable.",
    tema: "captacion",
    color: "toffee",
    glyph: "◈",
    format: "Vídeo + guía",
    progress: 80,
  },
  {
    id: "maquina-bienvenida",
    status: "en-construccion",
    title: "La máquina de bienvenida",
    blurb:
      "Tres emails que se programan solos cuando alguien se suscribe: curso, historia y oferta. Construida en NBI; la guía para replicarla está en camino.",
    tema: "captacion",
    color: "coral",
    glyph: "✉",
    format: "Sistema + guía",
    progress: 60,
  },
];

/** Per-lesson presentation for the course pillar (glyph + format per widget). */
export const COURSE_LESSON_META: Record<
  string,
  { glyph: string; format: string }
> = {
  "que-es-un-token": { glyph: "▦", format: "Tokenizador" },
  "temperatura-y-aleatoriedad": { glyph: "∿", format: "Sandbox" },
  "cuanto-cuesta-la-ia": { glyph: "€", format: "Calculadora" },
  "cuando-la-ia-alucina": { glyph: "?", format: "Quiz" },
  "que-es-rag": { glyph: "⛁", format: "Explorable" },
  "vida-de-un-prompt": { glyph: "▷", format: "Scrollytelling" },
};
