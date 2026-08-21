import { ScrollyIntro } from "@/components/home/scrolly/scrolly-intro";
import { Masthead } from "@/components/home/masthead";
import { StartHere } from "@/components/home/start-here";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { CadenceStrip } from "@/components/home/cadence-strip";
import { HomeArchive } from "@/components/home/home-archive";
import { YouTubeStrip } from "@/components/home/youtube-strip";
import { ClosingCta } from "@/components/home/closing-cta";
import { Manifesto } from "@/components/home/manifesto";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";
import { getJourneyStatusLines } from "@/lib/journey";
import { JsonLd } from "@/components/ui/json-ld";
import { websiteJsonLd, personJsonLd } from "@/lib/jsonld";

/** Refresh hourly: journey week, subscriber count and radar cadence stay honest. */
export const revalidate = 3600;

/**
 * Home as a publication front page rather than a landing page.
 *
 * The order is an argument that earns its ask: say who this is for and what the
 * visitor gets (masthead), prove the "no ruido, señal" claim in pictures
 * (ScrollyIntro, skippable in one click and hidden for return visitors),
 * answer "where do I start" (StartHere), show the shelf being argued for
 * (LibraryShowcase), prove the machine runs (CadenceStrip), show there is depth
 * behind it (HomeArchive) — and only then ask for an email (ClosingCta), with
 * the author note last.
 *
 * The masthead leads since 2026-08-21. The intro used to open the page, which
 * put the site's actual promise — the h1 — six screens deep: a returning
 * visitor had already dismissed the cinema, and a crawler saw a wall of sticky
 * scenes before the sentence that says what this is. The intro is the brand's
 * signature, but it is an argument in pictures, and an argument follows its
 * thesis; it does not replace it. The intro-gate script in the layout still
 * removes it entirely on return visits.
 *
 * Two email forms on the whole page, both below the fold: the closing block
 * and the footer. There used to be three, the first of them above the fold,
 * which is the landing-page reflex that made a blog read as a funnel.
 */
export default async function Home() {
  const subscriberCount = await getConfirmedSubscriberCount();
  // Same call the JourneyPanel makes inside the masthead, so the terminal in the
  // intro and the panel it restates can never print different numbers.
  const statusLines = getJourneyStatusLines(subscriberCount);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <Masthead subscriberCount={subscriberCount} />
      <ScrollyIntro statusLines={statusLines} />
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
