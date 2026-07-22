import { allPosts, getPostsByTag } from "@/lib/posts";
import { LIBRARY_ITEMS } from "@/config/library";
import { JOURNEY_WEEK } from "@/components/home/journey-panel";
import { siteConfig } from "@/config/site";

/**
 * Lab ticker under the hero — the journey's real numbers scrolling as a
 * marquee (mono + crimson separators). Content is duplicated once for the
 * seamless -50% CSS loop; reduced-motion freezes it into a static strip.
 */
export function StatusTicker() {
  const published = LIBRARY_ITEMS.filter((i) => i.status === "disponible").length;
  const building = LIBRARY_ITEMS.filter(
    (i) => i.status === "en-construccion",
  ).length;

  const items = [
    `semana ${JOURNEY_WEEK} construyendo en público`,
    `misión: ${siteConfig.journey.mission}`,
    `${published} sistemas publicados`,
    `${building} en el taller`,
    `${allPosts.length} artículos · ${getPostsByTag("interactivo").length} interactivos`,
    "radar cada lunes",
    "sin humo",
  ];

  const strip = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-6 pr-6 font-mono text-xs uppercase tracking-widest text-on-dark-faint"
        >
          <span aria-hidden className="text-salmon">
            ▸
          </span>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-dark-border bg-dark py-3">
      <div className="ticker-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
