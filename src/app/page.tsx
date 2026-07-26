import { Hero } from "@/components/home/hero";
import { CadenceStrip } from "@/components/home/cadence-strip";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { Manifesto } from "@/components/home/manifesto";
import { YouTubeStrip } from "@/components/home/youtube-strip";
import { ClosingCta } from "@/components/home/closing-cta";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";

/** Refresh hourly: journey week, subscriber count and radar stay honest. */
export const revalidate = 3600;

/**
 * Home = direct editorial blog layout (retires the "El Universo" star map,
 * 2026-07-26: it read as exploration, not as a professional AI blog).
 * Hero states the value prop with no scroll/click required; the rest proves
 * it with real content — Radar headlines, the systems library, the journey.
 */
export default async function Home() {
  const subscriberCount = await getConfirmedSubscriberCount();

  return (
    <>
      <Hero subscriberCount={subscriberCount} />
      <CadenceStrip />
      <LibraryShowcase />
      <Manifesto />
      <YouTubeStrip />
      <ClosingCta />
    </>
  );
}
