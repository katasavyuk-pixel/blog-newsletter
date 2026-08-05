import { Masthead } from "@/components/home/masthead";
import { StartHere } from "@/components/home/start-here";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { CadenceStrip } from "@/components/home/cadence-strip";
import { HomeArchive } from "@/components/home/home-archive";
import { YouTubeStrip } from "@/components/home/youtube-strip";
import { ClosingCta } from "@/components/home/closing-cta";
import { Manifesto } from "@/components/home/manifesto";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";
import { JsonLd } from "@/components/ui/json-ld";
import { websiteJsonLd } from "@/lib/jsonld";

/** Refresh hourly: journey week, subscriber count and radar cadence stay honest. */
export const revalidate = 3600;

/**
 * Home as a publication front page rather than a landing page.
 *
 * The order is an argument that earns its ask: say who this is for (masthead),
 * answer "where do I start" (StartHere), show the shelf being argued for
 * (LibraryShowcase), prove the machine runs (CadenceStrip), show there is depth
 * behind it (HomeArchive) — and only then ask for an email (ClosingCta), with
 * the author note last.
 *
 * Two email forms on the whole page now, both below the fold: the closing block
 * and the footer. There used to be three, the first of them above the fold,
 * which is the landing-page reflex that made a blog read as a funnel.
 */
export default async function Home() {
  const subscriberCount = await getConfirmedSubscriberCount();

  return (
    <>
      {/* WebSite only. The Person node with sameAs is episode-1 material — see
          src/lib/jsonld.ts and docs/geo-checklist.md. */}
      <JsonLd data={websiteJsonLd()} />
      <Masthead subscriberCount={subscriberCount} />
      <StartHere />
      <LibraryShowcase />
      <CadenceStrip />
      <HomeArchive />
      <YouTubeStrip />
      <ClosingCta />
      <Manifesto />
    </>
  );
}
