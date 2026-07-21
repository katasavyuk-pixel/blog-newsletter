import { Hero } from "@/components/home/hero";
import { NewsToday } from "@/components/home/news-today";
import { BlogHighlights } from "@/components/home/blog-highlights";
import { YouTubeStrip } from "@/components/home/youtube-strip";
import { InteractiveShowcase } from "@/components/home/interactive-showcase";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { AboutTeaser } from "@/components/home/about-teaser";
import { FinalCta } from "@/components/home/final-cta";

/** Section order follows the "Inicio" design: hero → news → posts → video → course → newsletter → about → CTA. */
export default function Home() {
  return (
    <>
      <Hero />
      <NewsToday />
      <BlogHighlights />
      <YouTubeStrip />
      <InteractiveShowcase />
      <NewsletterCta />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
