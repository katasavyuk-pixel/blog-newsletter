import { Hero } from "@/components/home/hero";
import { BlogHighlights } from "@/components/home/blog-highlights";
import { InteractiveShowcase } from "@/components/home/interactive-showcase";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { AboutTeaser } from "@/components/home/about-teaser";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BlogHighlights />
      <InteractiveShowcase />
      <NewsletterCta />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
