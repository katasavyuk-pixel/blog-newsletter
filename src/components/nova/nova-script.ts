import { siteConfig } from "@/config/site";

/**
 * NOVA's script — every line the copilot says lives here, in Kata's voice
 * (direct, first person, measured cheek; spec §voz). Edit THIS file to change
 * how NOVA speaks; the component only renders it. v1 is fully scripted (no
 * LLM, 0 API cost) — Fase 4 (embeddings) will give the same character a
 * brain without touching the UI.
 */

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
/** Journey week, module scope (react-hooks/purity precedent in lib/universe). */
export const novaWeek = Math.max(
  1,
  Math.floor((Date.now() - +new Date(siteConfig.journey.start)) / MS_PER_WEEK) + 1,
);

export type NovaWizardOption = {
  id: string;
  label: string;
  reply: string;
  href: string | null;
};

export const novaScript = {
  name: "NOVA",
  role: "copiloto",

  wizard: {
    greeting: [
      "Hola. Soy NOVA, la primera partícula de este universo.",
      `Aquí hay un tío montando una empresa de IA en público — sin humo y sin gurús. Vamos por la semana ${novaWeek}.`,
    ],
    ask: "¿Qué te trae por aquí?",
    options: [
      {
        id: "montando",
        label: "Estoy montando algo",
        reply:
          "Entonces te llevo a los Sistemas: lo que ya funciona en un negocio real, listo para copiar. Gratis.",
        href: "/sistemas",
      },
      {
        id: "entender",
        label: "Quiero entender la IA de verdad",
        reply:
          "La Constelación: seis lecciones donde la IA se toca, no se lee. Cada una que completas enciende una estrella.",
        href: "/empieza-aqui",
      },
      {
        id: "video",
        label: "Vengo del vídeo",
        reply: "Tu recurso te está esperando. Te llevo directo.",
        href: "/recursos",
      },
      {
        id: "curiosear",
        label: "Solo curiosear",
        reply:
          "Perfecto. Arrastra para volar, la rueda hace zoom, y todo lo que brilla se puede tocar.",
        href: null,
      },
    ] satisfies NovaWizardOption[],
    emailAsk:
      "¿Te guardo las coordenadas? Cuando se encienda un sistema nuevo, te aviso. Sin spam — ni tengo tiempo de mandarlo.",
    go: "Te llevo →",
    stay: "A explorar →",
    later: "Luego",
  },

  menu: {
    title: "¿Qué necesitas?",
    navTitle: "Llévame a…",
    nav: [
      { label: "el mapa", href: "/" },
      { label: "los sistemas", href: "/sistemas" },
      { label: "la constelación (curso)", href: "/empieza-aqui" },
      { label: "el radar", href: "/blog/tag/radar" },
      { label: "los recursos", href: "/recursos" },
      { label: "el origen", href: "/sobre-mi" },
    ],
    whatIsThis: "¿Qué es esto?",
    progress: "Mi progreso",
    save: "Guardar coordenadas",
    muteOn: "No molestar",
    muteOff: "Vuelve a hablarme",
    back: "← volver",
  },

  news: {
    title: "Desde tu última visita",
    post: "nuevo en el universo:",
    radar: "cayó el radar del lunes",
  },

  progress: {
    title: "Tu constelación",
    celebrate:
      "⭐ Estrella encendida. La constelación crece — y el mapa lo sabe.",
    none: "Aún no has encendido ninguna estrella. La primera lección son diez minutos y un tokenizador que puedes romper.",
    some: (lit: number, total: number) =>
      `${lit}/${total} estrellas encendidas. La constelación va tomando forma.`,
    all: "6/6. La constelación entera brilla. Chapó — ahora ya sabes más de IA aplicada que la mayoría de gurús que la venden.",
    continueCta: "Continuar el curso →",
    startCta: "Encender la primera →",
  },
} as const;

/** Contextual "what is this" per route — first match wins. */
const WHAT_IS_THIS: [RegExp, string][] = [
  [
    /^\/$/,
    "El mapa del universo. Cada astro es algo real de mi negocio: los sistemas encendidos funcionan en producción, las protoestrellas se están formando en NBI, y el radar barre las noticias cada lunes. Nada es decorado.",
  ],
  [
    /^\/sistemas/,
    "La biblioteca de sistemas: todo lo que ya está probado en un negocio real, gratis y replicable. Lo que ves en formación se enciende cuando funciona de verdad — antes no.",
  ],
  [
    /^\/empieza-aqui/,
    "El curso interactivo: seis lecciones donde manipulas la IA de verdad — tokenizadores, temperatura, costes. Tu progreso se guarda solo en este navegador.",
  ],
  [
    /^\/blog\/tag\/radar/,
    "El radar: noticias de IA filtradas y verificadas cada lunes por un pipeline anti-alucinación con revisión humana. Funciona en este mismo blog.",
  ],
  [
    /^\/blog\/[^/]+$/,
    "Una estación de lectura. Aquí el universo se calla para que leas a gusto. Si el artículo tiene widgets, tócalos: no se rompen (y si se rompen, mejor).",
  ],
  [
    /^\/recursos/,
    "Los recursos descargables: plantillas y guías a cambio de tu email, con doble confirmación y baja de un clic. Lo legal, en serio.",
  ],
  [
    /^\/sobre-mi/,
    "El origen: quién soy, por qué construyo esto en público y por qué regalo los sistemas. El big bang fue el 24 de junio de 2026.",
  ],
];

export function novaWhatIsThis(pathname: string): string {
  for (const [pattern, text] of WHAT_IS_THIS) {
    if (pattern.test(pathname)) return text;
  }
  return "Una esquina del universo que aún no tiene placa. Dale al mapa y te ubico.";
}
