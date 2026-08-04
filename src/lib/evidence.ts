/**
 * Evidence — credibility badges that are derived and checked, not typed by hand.
 *
 * ESTRATEGIA.md already fixes the editorial rule: every important claim rests on
 * a real screen, a reproducible test, or lived experience marked as such. This
 * encodes that rule as a type, so the site cannot claim something is "en
 * producción" without saying where, or announce a system "en el taller" without
 * a date it is answerable to.
 *
 * The invariants below throw at module load, which means `next build` fails.
 * That is deliberate: a promise the site can no longer keep should stop a
 * deploy, not decay quietly on the homepage the way the last two did.
 */

export type Evidencia =
  /** Something running that a reader can go and look at. */
  | { tipo: "en-produccion"; url: string; desde: string }
  /** Code or a path a reader can run themselves. */
  | { tipo: "reproducible"; ruta: string }
  /** A number, and where it came from. Never a number on its own. */
  | { tipo: "medido"; dato: string; fuente: string }
  /** Own experience, explicitly marked as own experience. */
  | { tipo: "experiencia"; nota: string }
  /** Announced work. `eta` is mandatory — see assertEvidencia. */
  | { tipo: "en-taller"; eta: string; progreso?: number };

/** ETA granularity is a month: "2026-09". Day-level dates would be fiction. */
const ETA_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Sortable current month, e.g. "2026-08". */
function currentMonth(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Throws if the evidence does not back the claim it makes.
 *
 * `where` names the offending item so the build error points at the fix rather
 * than at this file.
 */
export function assertEvidencia(where: string, evidencia: Evidencia, now = new Date()): void {
  const fail = (why: string) => {
    throw new Error(`Evidencia inválida en "${where}": ${why}`);
  };

  switch (evidencia.tipo) {
    case "en-produccion":
      if (!evidencia.url.trim()) {
        fail('"en-produccion" necesita una url que el lector pueda abrir.');
      }
      if (!evidencia.desde.trim()) {
        fail('"en-produccion" necesita `desde` (desde cuándo lleva funcionando).');
      }
      break;

    case "reproducible":
      if (!evidencia.ruta.trim()) {
        fail('"reproducible" necesita la ruta del código que se puede correr.');
      }
      break;

    case "medido":
      // The one rule VOZ.md states twice: never publish a number you cannot source.
      if (!evidencia.fuente.trim()) {
        fail(`"medido" declara el dato "${evidencia.dato}" sin fuente. Una cifra sin origen no se publica.`);
      }
      break;

    case "experiencia":
      if (!evidencia.nota.trim()) {
        fail('"experiencia" necesita la nota que la marca como experiencia propia.');
      }
      break;

    case "en-taller": {
      if (!ETA_PATTERN.test(evidencia.eta)) {
        fail(
          `"en-taller" necesita una ETA con formato YYYY-MM (recibido: "${evidencia.eta}"). ` +
            "Anunciar algo sin fecha es la promesa abierta que este invariante existe para impedir.",
        );
      }
      if (evidencia.eta < currentMonth(now)) {
        fail(
          `la ETA ${evidencia.eta} ya venció. Publícalo, o mueve la fecha a un mes que puedas sostener. ` +
            "Se prefiere romper la build a dejar en la home una promesa caducada.",
        );
      }
      if (evidencia.progreso !== undefined && (evidencia.progreso < 0 || evidencia.progreso > 100)) {
        fail(`progreso fuera de rango: ${evidencia.progreso}.`);
      }
      break;
    }
  }
}

/**
 * Short badge text — the claim only.
 *
 * The source is deliberately not concatenated here: a card badge reading
 * "6 lecciones · src/config/course.ts" helps nobody. Requiring the source and
 * displaying it are separate jobs — the type enforces that it exists, and the
 * article-level evidence block is where it gets shown.
 */
export function evidenciaLabel(evidencia: Evidencia): string {
  switch (evidencia.tipo) {
    case "en-produccion":
      return `en producción desde ${evidencia.desde}`;
    case "reproducible":
      return "reproducible · código publicado";
    case "medido":
      return evidencia.dato;
    case "experiencia":
      return evidencia.nota;
    case "en-taller":
      return `en el taller · ETA ${evidencia.eta}`;
  }
}

/** Where the claim can be checked, for the article-level evidence block. */
export function evidenciaFuente(evidencia: Evidencia): string | null {
  switch (evidencia.tipo) {
    case "en-produccion":
      return evidencia.url;
    case "reproducible":
      return evidencia.ruta;
    case "medido":
      return evidencia.fuente;
    case "experiencia":
    case "en-taller":
      return null;
  }
}
