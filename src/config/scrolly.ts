/**
 * Scrollytelling intro (F2) — single source for copy and scene data.
 * Narrative: ruido → señal → sistema, landing on the masthead.
 */

export const SCENE_COPY = {
  ruido: {
    kicker: "el ruido",
    closing: "Cada semana, esto.",
  },
  senal: {
    kicker: "la señal",
    closing: "De cien ruidos, siete señales.",
  },
  sistema: {
    kicker: "el sistema",
    liveTag: "EN DIRECTO — estado del viaje",
  },
} as const;

/** Hype headlines floating in scene 1. Pure noise, all hat, no cattle. */
export const NOISE_WORDS = [
  "LA IA LO CAMBIA TODO",
  "AGI EN 2027",
  "10x TU PRODUCTIVIDAD",
  "LOS PROMPTS SON EL NUEVO CÓDIGO",
  "ESTA IA SUSTITUYE A TU EQUIPO",
  "GPT-8 FILTRADO",
  "EL FIN DE LOS PROGRAMADORES",
  "HAZTE RICO CON AGENTES",
  "LA IA YA TIENE CONSCIENCIA",
  "AUTOMATIZA TODO EN 5 MINUTOS",
  "ESTE MODELO ROMPE INTERNET",
  "DEJA TU TRABAJO, LA IA PAGA",
  "100 AGENTES GRATIS",
  "SIN IA ESTÁS MUERTO",
  "LA STARTUP DE UN SOLO PROMPT",
  "TU COMPETENCIA YA USA AGENTES",
  "ESTO ES SOLO EL PRINCIPIO",
  "MILLONES SIN EMPLEADOS",
  "¿SIGUES ESCRIBIENDO A MANO?",
  "EL FUTURO YA LLEGÓ",
  "NO TE QUEDES ATRÁS",
  "REVOLUCIÓN TOTAL",
  "LA IA QUE PROGRAMA SOLA",
  "EL HYPE ES REAL",
] as const;

export type SignalItem = {
  title: string;
  source: string;
  date: string;
};

/**
 * Real headlines from actual Radar editions (curated from content/posts/radar-*).
 * They are what survives when Chispa filters the noise in scene 2.
 */
export const SIGNAL_ITEMS: SignalItem[] = [
  {
    title: "OK, Well, There Are Even More AI Agent Hacking Incidents",
    source: "Wired AI",
    date: "2026-08-04",
  },
  {
    title: "Open-weight AI models are catching up to the frontier. The safety gap remains.",
    source: "TechCrunch AI",
    date: "2026-08-04",
  },
  {
    title: "Here's why AI agents lie and cheat to reach their goals",
    source: "MIT Technology Review",
    date: "2026-08-04",
  },
  {
    title: "Anthropic's $1.5 billion book piracy settlement approved by judge",
    source: "The Verge AI",
    date: "2026-07-21",
  },
  {
    title: "Trump administration reportedly drafting ban on Chinese datacenter components",
    source: "The Guardian AI",
    date: "2026-08-04",
  },
];
