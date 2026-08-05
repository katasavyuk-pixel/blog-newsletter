import { allPosts, getPostsByTag } from "@/lib/posts";
import { LIBRARY_ITEMS, libraryStatus } from "@/config/library";
import { siteConfig } from "@/config/site";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Journey week, frozen per build/revalidation (module scope keeps render pure). */
export const JOURNEY_WEEK =
  Math.floor(
    (Date.now() - new Date(siteConfig.journey.start).getTime()) / WEEK_MS,
  ) + 1;

/**
 * Real build-time status lines of the public journey — the single source used
 * by both the masthead `JourneyPanel` and the scrollytelling terminal scene.
 */
export function getJourneyStatusLines(
  subscriberCount: number | null,
): string[] {
  const published = LIBRARY_ITEMS.filter(
    (i) => libraryStatus(i) === "disponible",
  ).length;
  const building = LIBRARY_ITEMS.filter(
    (i) => libraryStatus(i) === "en-construccion",
  ).length;
  const latestRadar = getPostsByTag("radar")[0];
  const showCount =
    subscriberCount !== null &&
    subscriberCount >= siteConfig.newsletter.showCountFrom;

  return [
    `misión: ${siteConfig.journey.mission}`,
    `semana ${JOURNEY_WEEK} · construyendo en público`,
    `sistemas: ${published} publicados · ${building} en el taller`,
    `${allPosts.length} artículos · ${getPostsByTag("interactivo").length} interactivos`,
    latestRadar ? `radar: edición ${latestRadar.date.slice(0, 10)} ✓` : null,
    showCount ? `suscriptores: ${subscriberCount}` : null,
  ].filter(Boolean) as string[];
}
