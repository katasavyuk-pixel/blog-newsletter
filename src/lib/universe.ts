import { siteConfig } from "@/config/site";
import { LIBRARY_ITEMS, COURSE_LESSON_META } from "@/config/library";
import { COURSE_SLUGS } from "@/config/course";
import {
  ANCHORS,
  BANDS,
  ASTRO_SIZE,
  placeInBand,
  polar,
  type Astro,
  type UniverseData,
} from "@/config/universe";
import { allPosts, getPost } from "@/lib/posts";
import { getLatestRadarEdition } from "@/lib/radar";
import { formatDate } from "@/lib/format";

/**
 * Server-only builder for the star map: hydrates the universe's content from
 * the existing SSOTs (library, course, posts, radar, journey) and returns a
 * serializable UniverseData that flows to the client map as props.
 *
 * Mapping (spec §arquitectura): the course is the Constelación, `disponible`
 * library items are Sistemas (minus the course itself and the radar system,
 * which get their own astros), `en-construccion` items are Protoestrellas on
 * the frontier, the radar is the Púlsar, the newsletter is la Señal, posts
 * with a video feed la Sonda, and recent non-course articles are Cometas.
 */

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
// Module scope on purpose (react-hooks/purity precedent): recomputed per
// server process; the home revalidates hourly, weeks change weekly.
const journeyWeek = Math.max(
  1,
  Math.floor((Date.now() - +new Date(siteConfig.journey.start)) / MS_PER_WEEK) + 1,
);

export function buildUniverse(): UniverseData {
  const astros: Astro[] = [];

  astros.push({
    id: "nucleo",
    kind: "nucleo",
    name: "NBI",
    sub: `semana ${journeyWeek} · ${siteConfig.journey.mission}`,
    blurb:
      "El núcleo: una empresa de IA construyéndose en público desde el 24-06-2026. Todo lo demás orbita alrededor.",
    href: "/sobre-mi",
    ...polar(ANCHORS.nucleo.r, ANCHORS.nucleo.angle),
    size: ASTRO_SIZE.nucleo,
  });

  const stars = COURSE_SLUGS.map((slug, index) => ({
    slug,
    title: getPost(slug)?.title ?? slug,
    glyph: COURSE_LESSON_META[slug]?.glyph ?? "★",
    index,
  }));
  astros.push({
    id: "constelacion",
    kind: "constelacion",
    name: "La Constelación",
    sub: `curso interactivo · ${stars.length} estrellas`,
    blurb:
      "Entiende la IA tocándola: seis lecciones interactivas. Cada una que completas, enciende su estrella.",
    href: "/empieza-aqui",
    ...polar(ANCHORS.constelacion.r, ANCHORS.constelacion.angle),
    size: ASTRO_SIZE.constelacion,
    stars,
  });

  const systems = LIBRARY_ITEMS.filter(
    (item) =>
      item.status === "disponible" &&
      item.id !== "curso-ia" &&
      item.id !== "radar-automatico",
  );
  systems.forEach((item, index) => {
    const post = item.slug ? getPost(item.slug) : undefined;
    astros.push({
      id: item.id,
      kind: "sistema",
      name: item.title ?? post?.title ?? item.id,
      sub: item.proof ?? item.format,
      blurb: item.blurb ?? post?.description,
      href: item.href ?? (post ? post.permalink : undefined),
      ...placeInBand(BANDS.sistema, item.id, index, systems.length),
      size: ASTRO_SIZE.sistema,
      glyph: item.glyph,
    });
  });

  const forming = LIBRARY_ITEMS.filter((item) => item.status === "en-construccion");
  forming.forEach((item, index) => {
    astros.push({
      id: item.id,
      kind: "protoestrella",
      name: item.title ?? item.id,
      sub: `formación ${item.progress ?? 0}% · en NBI`,
      blurb: item.blurb,
      ...placeInBand(BANDS.protoestrella, item.id, index, forming.length),
      size: ASTRO_SIZE.protoestrella,
      glyph: item.glyph,
      progress: item.progress ?? 0,
    });
  });

  const radarItem = LIBRARY_ITEMS.find((item) => item.id === "radar-automatico");
  const radar = getLatestRadarEdition();
  astros.push({
    id: "radar",
    kind: "pulsar",
    name: "El Radar",
    sub: radar
      ? `cada lunes · última: ${formatDate(radar.edition.date)}`
      : "cada lunes",
    blurb: radarItem?.blurb,
    href: "/blog/tag/radar",
    ...polar(ANCHORS.pulsar.r, ANCHORS.pulsar.angle),
    size: ASTRO_SIZE.pulsar,
    blips: radar?.headlines.slice(0, 3).map(({ title, url }) => ({ title, url })),
  });

  astros.push({
    id: "senal",
    kind: "baliza",
    name: "La Señal",
    sub: "cada sistema nuevo · sin spam",
    blurb: siteConfig.newsletter.description,
    ...polar(ANCHORS.baliza.r, ANCHORS.baliza.angle),
    size: ASTRO_SIZE.baliza,
  });

  const [video] = allPosts.filter((post) => post.youtubeId);
  if (video) {
    astros.push({
      id: "sonda",
      kind: "sonda",
      name: "La Sonda",
      sub: "el viaje en vídeo",
      blurb: video.title,
      href: "/blog/tag/construccion-publica",
      ...polar(ANCHORS.sonda.r, ANCHORS.sonda.angle),
      size: ASTRO_SIZE.sonda,
      youtubeId: video.youtubeId,
    });
  }

  const courseSlugs = new Set<string>(COURSE_SLUGS);
  const comets = allPosts
    .filter((post) => !post.tags.includes("radar") && !courseSlugs.has(post.slug))
    .slice(0, 3);
  comets.forEach((post, index) => {
    astros.push({
      id: `cometa-${post.slug}`,
      kind: "cometa",
      name: post.title,
      sub: formatDate(post.date),
      href: post.permalink,
      ...placeInBand(BANDS.cometa, post.slug, index, comets.length),
      size: ASTRO_SIZE.cometa,
    });
  });

  return {
    week: journeyWeek,
    mission: siteConfig.journey.mission,
    astros,
  };
}
