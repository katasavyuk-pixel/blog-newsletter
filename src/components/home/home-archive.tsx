import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArchiveList } from "@/components/content/content-row";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { allPosts } from "@/lib/posts";

/**
 * Recent archive — the section that does most of the work of making this read
 * like a publication rather than a landing page.
 *
 * Everything above it is an argument: a headline, three routes, a shelf. This
 * is the part that says there is depth behind the argument, and depth reads as
 * density. Rows, hairlines, no cards.
 */
export function HomeArchive({ limit = 8 }: { limit?: number }) {
  const posts = allPosts.slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-2">
      <ScrollReveal variant="blur">
        <Container size="wide" className="py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Lo último</Eyebrow>
              <h2 className="mt-3 headline text-3xl text-fg sm:text-4xl">
                Publicado hasta ahora
              </h2>
            </div>
            <Link
              href="/blog"
              className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
            >
              Archivo completo →
            </Link>
          </div>

          <ArchiveList posts={posts} className="mt-8 border-t border-border" />
        </Container>
      </ScrollReveal>
    </section>
  );
}
