import { Hero } from "@/components/home/hero";
import { AchievementsBadge } from "@/components/home/achievements-badge";
import { BlogHighlights } from "@/components/home/blog-highlights";
import { InteractiveShowcase } from "@/components/home/interactive-showcase";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { AboutTeaser } from "@/components/home/about-teaser";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto flex max-w-5xl justify-center px-4 pb-8">
        <AchievementsBadge />
      </section>
      <BlogHighlights />
      <InteractiveShowcase />
      <NewsletterCta />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
