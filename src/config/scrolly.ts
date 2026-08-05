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
 * What survives when Chispa filters the noise in scene 2.
 *
 * These are the seven `<RadarItem>` of `content/posts/radar-2026-08-04.mdx`,
 * verbatim — same titles, same sources, same dates, curly apostrophes included.
 * The scene closes on "De cien ruidos, siete señales", so the list has to be
 * seven and it has to be a real edition: this list is checkable against the post,
 * and on a site whose whole argument is that the numbers can be checked, a
 * decorative five would be the one lie on the page.
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
    title: "Trump administration reportedly drafting ban on Chinese datacenter components",
    source: "The Guardian AI",
    date: "2026-08-04",
  },
  {
    title: "China’s Alibaba takes another swipe at America’s AI supremacy",
    source: "The Verge AI",
    date: "2026-08-03",
  },
  {
    title: "Here’s why AI agents lie and cheat to reach their goals",
    source: "MIT Technology Review",
    date: "2026-08-03",
  },
  {
    title: "Claude published malicious code to the Internet and attacked 3 real companies",
    source: "Ars Technica",
    date: "2026-07-31",
  },
  {
    title: "A fundamental flaw leaves LLMs strikingly vulnerable to attack",
    source: "MIT Technology Review",
    date: "2026-07-30",
  },
];
