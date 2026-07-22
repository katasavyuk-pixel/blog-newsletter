/**
 * "El Universo" — shape of the star map (redesign 2026-07-23, see
 * docs/superpowers/specs/2026-07-23-rediseno-universo-design.md).
 *
 * This file is the SSOT for the universe's GEOMETRY: astro types, world
 * constants and the deterministic placement math. It is pure and client-safe
 * (zero imports) so the map components can use it directly. The universe's
 * CONTENT (which astros exist, hydrated from library/course/posts/radar) is
 * built server-side in src/lib/universe.ts and reaches the client as props.
 *
 * Placement rule: no hand-written coordinates for collections. Singleton
 * astros (núcleo, constelación, señal, radar, sonda) have fixed composition
 * anchors here; every collection item (sistemas, protoestrellas, cometas)
 * gets a deterministic position from its band + slug hash, so new content
 * lands on the frontier without touching layout code.
 */

export type AstroKind =
  | "nucleo"
  | "constelacion"
  | "sistema"
  | "protoestrella"
  | "pulsar"
  | "baliza"
  | "sonda"
  | "cometa";

export type ConstellationStar = {
  slug: string;
  title: string;
  glyph: string;
  /** Pedagogical order, 0-based. */
  index: number;
};

export type RadarBlip = { title: string; url: string };

export type Astro = {
  id: string;
  kind: AstroKind;
  /** Display name (Anton on the map). */
  name: string;
  /** Mono HUD sub-line ("SEM 5 · primeros clientes de NBI"). */
  sub?: string;
  /** Longer line for the focus panel / tooltip. */
  blurb?: string;
  /** Station this astro lands on. Absent = opens an in-map overlay. */
  href?: string;
  /** World coordinates (center = 0,0). */
  x: number;
  y: number;
  /** Base visual diameter in world units. */
  size: number;
  glyph?: string;
  /** Protoestrellas: formation 0-100. */
  progress?: number;
  /** Constelación payload: the course lessons. */
  stars?: ConstellationStar[];
  /** Púlsar payload: latest radar headlines. */
  blips?: RadarBlip[];
  /** Sonda payload: latest video. */
  youtubeId?: string;
};

export type UniverseData = {
  /** Weeks since the big bang (journey.start), >= 1. */
  week: number;
  mission: string;
  astros: Astro[];
};

export const TAU = Math.PI * 2;

/** Outer edge of the world (comets band ends here). */
export const WORLD_RADIUS = 1200;

/** Expansion rings drawn on the map: one per week, capped for clarity. */
export const MAX_RINGS = 16;

/** Fixed composition anchors { radius, angle } for singleton astros. */
export const ANCHORS = {
  nucleo: { r: 0, angle: 0 },
  baliza: { r: 330, angle: -0.55 },
  constelacion: { r: 430, angle: 2.35 },
  pulsar: { r: 590, angle: 4.05 },
  sonda: { r: 860, angle: 5.3 },
} as const;

/** Radial bands + base angle for collection astros. */
export const BANDS = {
  sistema: { rMin: 640, rMax: 780, baseAngle: 0.85 },
  protoestrella: { rMin: 900, rMax: 990, baseAngle: 3.55 },
  cometa: { rMin: 1010, rMax: 1160, baseAngle: 0.3 },
} as const;

/** Base visual diameter per kind (world units). */
export const ASTRO_SIZE: Record<AstroKind, number> = {
  nucleo: 120,
  constelacion: 150,
  sistema: 52,
  protoestrella: 64,
  pulsar: 72,
  baliza: 64,
  sonda: 48,
  cometa: 18,
};

/** Deterministic [0,1) from a string (FNV-1a 32-bit). */
export function hash01(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0x100000000;
}

export function polar(r: number, angle: number): { x: number; y: number } {
  return { x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)) };
}

/**
 * Position a collection item inside its band: evenly spaced around the
 * circle (golden-ish arc from the band's base angle) with a small hash
 * jitter so the layout looks organic yet never changes between builds.
 */
export function placeInBand(
  band: { rMin: number; rMax: number; baseAngle: number },
  id: string,
  index: number,
  count: number,
): { x: number; y: number } {
  const angle =
    band.baseAngle +
    (index * TAU) / Math.max(count, 3) +
    (hash01(id) - 0.5) * 0.4;
  const r = band.rMin + hash01(`${id}:r`) * (band.rMax - band.rMin);
  return polar(r, angle);
}
