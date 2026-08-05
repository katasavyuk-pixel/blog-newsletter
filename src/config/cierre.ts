/**
 * The standard article/newsletter closing — three exits, always the same three.
 *
 * This replaces a switch on `formato` that showed exactly one of three different
 * calls to action. The switch was not wrong, it was just unmeasurable: a reader
 * never saw the same closing twice, so no habit formed and nothing could be
 * compared. Repetition is what makes a closing work.
 *
 * Strings live here, not in the components, because the same three exits appear
 * on the web (Tailwind) and in email (table-based, inline-styled). Sharing the
 * markup between those two is a classic trap; sharing the copy is the point.
 *
 * On the offer: this deliberately does NOT say "diagnóstico". Marca-Personal's
 * EMBUDO.md is explicit — "Diagnóstico con entregable por encima de la charla
 * gratis. Hoy no se ofrece." — and there is no scope, price or deliverable
 * behind the word yet. The ask is a description of a problem, which is also the
 * only metric that counts in this phase: qualified inbound conversations.
 */

import { siteConfig } from "@/config/site";

export type SalidaId = "curso" | "trabajo" | "responder";

export type Salida = {
  id: SalidaId;
  /** Short mono label above the title. */
  kicker: string;
  titulo: string;
  descripcion: string;
  href: string;
  /** Link text. */
  accion: string;
};

export const CIERRE_SALIDAS: readonly Salida[] = [
  {
    id: "curso",
    kicker: "Aprender",
    titulo: "Entiende la IA tocándola",
    descripcion:
      "Seis lecciones en orden, de los tokens a la vida completa de un prompt. Gratis, sin cuenta, y el progreso se guarda en tu navegador.",
    href: "/empieza-aqui",
    accion: "Ver el itinerario",
  },
  {
    id: "trabajo",
    kicker: "Aplicarlo",
    titulo: "¿Tienes un proceso que se come las horas?",
    descripcion:
      "Leer correos, sacar datos de documentos, tareas que alguien repite a mano cada día. Cuéntame cuál es y te digo qué haría yo — a veces la respuesta es que la IA no ayuda.",
    href: "/trabaja-con-nbi",
    accion: "Contarme tu caso",
  },
  {
    id: "responder",
    kicker: "Escribirme",
    titulo: "O simplemente responde",
    descripcion:
      "Si algo de aquí te ha servido, o te ha parecido mal, quiero saberlo. Lo leo yo y cambia lo que publico.",
    href: `mailto:${siteConfig.replyEmail}`,
    accion: siteConfig.replyEmail,
  },
] as const;

/**
 * Which exit gets visual weight, derived from the article's format.
 *
 * The three exits always render, in the same order — this only decides emphasis.
 * It is the one piece of the old per-format switch worth keeping: a reader who
 * just finished a beginner lesson is better served by the course than by a
 * pitch, and that judgement was already encoded and correct.
 */
export function salidaDestacada(formato: string): SalidaId {
  if (formato === "leccion") return "curso";
  if (formato === "sistema" || formato === "caso") return "trabajo";
  return "responder";
}
