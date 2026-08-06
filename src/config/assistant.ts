/**
 * "Chispa", la IA compañera del sitio — extensión de la mascota del wizard (Fase 1):
 * flota por el blog, acompaña al visitante y responde a preguntas con un LLM real
 * **anclado a tu contenido** (nunca inventa fuera de él: es justo tu posicionamiento).
 *
 * Fuente única del copy del panel y del fallback sin clave. Nombres, modelo y
 * quick-actions viven aquí, editables sin tocar código.
 */

export const COMPANION = {
  name: "Chispa",
  greeting:
    "Soy Chispa, tu fichaje en este rincón. Pregúntame por el blog, los sistemas, el curso, el glosario o el radar.",
  placeholder: "Pregunta a Chispa…",
  /** Sin API key configurada — mensaje honesto, no un error feo. El nombre de la
   *  variable de entorno vivía aquí (y encima era el de otro proveedor): un
   *  lector no tiene por qué leer nuestra configuración. */
  offlineMessage:
    "Todavía no estoy conectada. Mientras tanto tienes el buscador de la casa: el curso en /empieza-aqui, los sistemas en /sistemas y el radar de la semana en /radar.",
  /** Error genérico de la API. */
  errorMessage: "Se me ha cruzado un circuito. Vuelve a intentarlo en un momento.",
  /** Texto accesible del botón flotante. */
  ctaLabel: "Abrir Chispa, la asistente del sitio",
  /** Abre el wizard de intención. Es la única puerta al wizard además de
   *  `?wizard=1`: dejó de abrirse solo al entrar (ver `use-intent-wizard`). */
  routeMeLabel: "¿Te pongo en ruta?",
} as const;

export type CompanionQuick = {
  label: string;
  /** Si `ask`, envía este texto como pregunta. Si `route`, navega. */
  ask?: string;
  route?: string;
};

/** Chips rápidos de debajo del chat: preguntas y accesos directos. */
export const QUICK_ACTIONS: CompanionQuick[] = [
  { label: "¿Qué es RAG?", ask: "¿Qué es RAG?" },
  { label: "Quiero aprender desde cero", route: "/empieza-aqui" },
  { label: "Sistemas", route: "/sistemas" },
  { label: "Radar de la semana", route: "/radar" },
  { label: "¿Cuánto cuesta la IA?", ask: "¿Cuánto cuesta montar IA? ¿Dónde hay una calculadora?" },
];