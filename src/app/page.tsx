import { Hero } from "@/components/home/hero";
import { CoursePillar } from "@/components/home/course-pillar";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { CadenceStrip } from "@/components/home/cadence-strip";
import { Manifesto } from "@/components/home/manifesto";
import { YouTubeStrip } from "@/components/home/youtube-strip";
import { ClosingCta } from "@/components/home/closing-cta";
import { getConfirmedSubscriberCount } from "@/lib/subscribers";

/** Refresh hourly so the journey panel's subscriber count stays honest. */
export const revalidate = 3600;

/**
 * Home = argument, library = page (redesign spec): hero capture → course
 * pillar → curated library wall → weekly cadence → manifesto → video →
 * closing capture. Exactly two forms (hero + closing).
 */
export default async function Home() {
  const subscriberCount = await getConfirmedSubscriberCount();

  return (
    <>
      <Hero subscriberCount={subscriberCount} />
      <CoursePillar />
      <LibraryShowcase />
      <CadenceStrip />
      <Manifesto />
      <YouTubeStrip />
      <ClosingCta />
    </>
  );
}
