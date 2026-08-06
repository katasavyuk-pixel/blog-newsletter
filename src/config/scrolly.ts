/**
 * Scrollytelling intro (F2) — single source for copy and scene data.
 * Narrative: ruido → señal → sistema, landing on the masthead.
 */

/**
 * How long each act lasts, as the height of its scroll track.
 *
 * A scene is pinned to a full-height viewport, so a `200vh` track spends one
 * screenful of scrolling going from progress 0 to 1 — the track height *is* the
 * pacing dial, and it is the one number anyone will want to argue with. Tune it
 * here; the three scenes read it and nothing else does.
 *
 * At 630vh the intro put 6.3 screens between the visitor and the h1, which was
 * a lot to ask of someone who just wanted the archive. Now 500vh on desktop,
 * 350vh on phones. Whole class strings on purpose: Tailwind reads source files
 * literally and would not generate a class it never sees spelled out.
 *
 * The totals have not moved since. Act three now draws a machine instead of
 * reprinting the masthead's console, so it takes the room act one gave back —
 * act one earns its beats faster now that its headlines are staged in depth.
 */
export const SCENE_TRACK = {
  ruido: "h-[100vh] sm:h-[140vh]",
  senal: "h-[130vh] sm:h-[190vh]",
  sistema: "h-[120vh] sm:h-[170vh]",
} as const;

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

/**
 * The Radar pipeline, drawn in act three.
 *
 * Every line here is a claim about a machine that exists, so every line is
 * checkable against the repo: ten feeds in `config/radar-sources.json` gathered
 * by `scripts/radar/collect.mjs` with no model in the loop, the url compared
 * verbatim by `scripts/radar/verify-edition.mjs` before a PR can open, and the
 * merge done by hand. If any of those stop being true, this copy is wrong and
 * the scene is the lie on the page.
 */
export const PIPELINE_STEPS = [
  { id: "recolecta", label: "recolecta", detail: "10 fuentes · sin LLM" },
  { id: "verifica", label: "verifica", detail: "url verbatim, o no hay PR" },
  { id: "publica", label: "publica", detail: "PR · lo mergeo yo" },
] as const;

/**
 * What the gate throws out.
 *
 * Not a hypothetical: retyping a headline turned `’` into `'`, the check was a
 * strict `!==`, and two editions died on it. The rejection is the interesting
 * half of the machine, so it is the half that gets animated.
 */
export const PIPELINE_REJECT = "título reescrito";

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
    title:
      "Open-weight AI models are catching up to the frontier. The safety gap remains.",
    source: "TechCrunch AI",
    date: "2026-08-04",
  },
  {
    title:
      "Trump administration reportedly drafting ban on Chinese datacenter components",
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
    title:
      "Claude published malicious code to the Internet and attacked 3 real companies",
    source: "Ars Technica",
    date: "2026-07-31",
  },
  {
    title: "A fundamental flaw leaves LLMs strikingly vulnerable to attack",
    source: "MIT Technology Review",
    date: "2026-07-30",
  },
];
