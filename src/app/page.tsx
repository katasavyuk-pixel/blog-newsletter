import { UniverseMap } from "@/components/universe/universe-map";
import { SemanticLayer } from "@/components/universe/semantic-layer";
import { buildUniverse } from "@/lib/universe";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";
import { siteConfig } from "@/config/site";

/** Refresh hourly: journey week, subscriber count and radar blips stay honest. */
export const revalidate = 3600;

/**
 * Home = the navigable star map (redesign "El Universo", 2026-07-23 spec).
 * The map is the experience; the SemanticLayer below is the crawlable,
 * accessible, no-JS truth of the same universe. Capture: la Señal on the map
 * (`senal-mapa`) + the anchored form in the list (`senal-lista`).
 */
export default async function Home() {
  const universe = buildUniverse();
  const count = await getConfirmedSubscriberCount();
  const subscriberCount =
    count != null && count >= siteConfig.newsletter.showCountFrom ? count : null;

  return (
    <>
      <section
        aria-label="El mapa del universo"
        className="relative h-[calc(100svh-4rem)] min-h-[480px]"
      >
        <UniverseMap data={universe} subscriberCount={subscriberCount} />
      </section>
      <SemanticLayer data={universe} />
    </>
  );
}
