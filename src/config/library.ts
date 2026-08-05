/**
 * "Biblioteca de Sistemas" — SSOT for every deliverable the site gives away.
 *
 * Honesty rule: every item must be real. What used to be a free-text `proof`
 * string plus an optional `progress` number is now a single `evidencia` value
 * (src/lib/evidence.ts), so a card cannot claim it is in production without
 * saying where, and cannot be announced "en el taller" without a date. The
 * invariants run at module load, so a broken claim fails `next build`.
 *
 * `status` is derived rather than declared: the previous shape allowed
 * `status: "disponible"` next to a half-finished item, and that is exactly the
 * contradiction that shipped a card pointing at an unpublished post.
 */

import { TEMAS, type Tema } from "@/config/taxonomy";
import { assertEvidencia, type Evidencia } from "@/lib/evidence";

export type ChipColor = "coral" | "navy" | "toffee" | "forest";

/** @deprecated Use `Tema` from config/taxonomy — kept so consumers keep compiling. */
export type LibraryTheme = Tema;

/** Display labels for the /sistemas theme blocks, in page order. */
export const LIBRARY_THEMES = TEMAS;

export type LibraryItem = {
  id: string;
  /** When set, title/blurb/href hydrate from the post with this slug. */
  slug?: string;
  title?: string;
  blurb?: string;
  href?: string;
  tema: Tema;
  color: ChipColor;
  glyph: string;
  /** Deliverable format shown as a badge (Curso interactivo, Calculadora…). */
  format: string;
  /** What backs the claim. Validated at module load. */
  evidencia: Evidencia;
};

/** Announced work reads as "en el taller"; everything else is shippable today. */
export function libraryStatus(item: LibraryItem): "disponible" | "en-construccion" {
  return item.evidencia.tipo === "en-taller" ? "en-construccion" : "disponible";
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: "curso-ia",
    title: "Entiende la IA tocándola",
    blurb:
      "Seis lecciones interactivas, de los tokens a la vida completa de un prompt. No lees cómo funciona la IA: la manipulas. Tu progreso se guarda solo.",
    href: "/empieza-aqui",
    tema: "ia-aplicada",
    color: "coral",
    glyph: "▦",
    format: "Curso interactivo",
    evidencia: {
      tipo: "medido",
      dato: "6 lecciones · gratis · sin registro",
      fuente: "src/config/course.ts",
    },
  },
  {
    id: "calculadora-costes",
    slug: "cuanto-cuesta-la-ia",
    tema: "economia",
    color: "forest",
    glyph: "€",
    format: "Calculadora",
    evidencia: {
      tipo: "en-produccion",
      url: "/blog/cuanto-cuesta-la-ia",
      desde: "junio de 2026",
    },
  },
  {
    id: "radar-automatico",
    title: "Radar IA en automático",
    blurb:
      "Noticias de IA filtradas y verificadas cada lunes, generadas por un pipeline anti-alucinación con checkpoint humano. Funciona en producción en este mismo blog.",
    href: "/radar",
    tema: "contenido",
    color: "navy",
    glyph: "◉",
    format: "Sistema en producción",
    // The old proof line read "en producción · cada lunes". The cadence half was
    // false for two weeks straight while the CI gate silently rejected editions,
    // so the claim is now just the part that is verifiable on sight.
    evidencia: {
      tipo: "en-produccion",
      url: "/radar",
      desde: "julio de 2026",
    },
  },
  {
    id: "stack-geo",
    title: "Stack GEO: que la IA recomiende tu negocio",
    blurb:
      "Que ChatGPT y compañía encuentren y citen tu web: llms.txt, datos estructurados y el porqué de cada pieza. Vídeo + guía replicable.",
    tema: "captacion",
    color: "toffee",
    glyph: "◈",
    format: "Vídeo + guía",
    evidencia: { tipo: "en-taller", eta: "2026-09", progreso: 80 },
  },
  {
    id: "maquina-bienvenida",
    title: "La máquina de bienvenida",
    blurb:
      "Tres emails que se programan solos cuando alguien se suscribe: curso, historia y oferta. Construida en NBI; la guía para replicarla está en camino.",
    tema: "captacion",
    color: "coral",
    glyph: "✉",
    format: "Sistema + guía",
    evidencia: { tipo: "en-taller", eta: "2026-10", progreso: 60 },
  },
];

// Fails the build rather than shipping a claim nothing backs.
for (const item of LIBRARY_ITEMS) {
  assertEvidencia(`LIBRARY_ITEMS["${item.id}"]`, item.evidencia);
}

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
