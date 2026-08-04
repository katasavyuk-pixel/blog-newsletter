/**
 * Closed editorial vocabulary — two orthogonal axes, both required on a post.
 *
 * Free tags produced 14 terms across 8 posts, 10 of them used exactly once, and
 * a real collision: `construccion-publica` and `construcción pública` are the
 * same topic on two different routes, which is what happens when the taxonomy
 * is whatever somebody typed. Velite validates against these keys, so a typo
 * fails the build instead of quietly inventing a category.
 *
 * `tema` = what it is about. `formato` = what kind of thing it is. They are
 * independent: a `sistema` can be about `captacion` or about `operaciones`.
 * Free `tags` survive as secondary long-tail keywords and drive no navigation.
 */

export const TEMA_KEYS = [
  "ia-aplicada",
  "captacion",
  "contenido",
  "operaciones",
  "economia",
] as const;

export type Tema = (typeof TEMA_KEYS)[number];

/** Display labels, in the order the /sistemas blocks render. */
export const TEMAS: Record<Tema, string> = {
  "ia-aplicada": "IA aplicada",
  captacion: "Captación y embudo",
  contenido: "Contenido en automático",
  operaciones: "Operaciones",
  economia: "Economía",
};

export const FORMATO_KEYS = [
  "sistema",
  "radar",
  "nota",
  "leccion",
  "herramienta",
  "caso",
] as const;

export type Formato = (typeof FORMATO_KEYS)[number];

/**
 * Radar axes. Lives here rather than beside either consumer: the map was
 * duplicated verbatim in radar-item.tsx and cadence-strip.tsx, so the two
 * surfaces could drift apart while looking identical.
 */
export const RADAR_AXES: Record<string, string> = {
  ia: "IA",
  negocio: "Negocio",
  geopolitica: "Geopolítica",
};

export const FORMATOS: Record<Formato, string> = {
  sistema: "Sistema",
  radar: "Radar",
  nota: "Nota",
  leccion: "Lección",
  herramienta: "Herramienta",
  caso: "Caso real",
};
