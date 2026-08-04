import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Nav } from "./nav";
import { siteConfig } from "@/config/site";

/** Sticky smoked-glass header: brand mark, primary nav and a newsletter CTA. */
export function Header() {
  return (
    // bg-bg/85, not bg-space: --color-space does not exist, so the translucent
    // backdrop silently resolved to nothing and the header sat on bare blur.
    <header className="sticky top-0 z-50 border-b border-dark-border bg-bg/85 text-on-dark backdrop-blur-md">
      <Container size="wide" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center"
          aria-label={`${siteConfig.name} — inicio`}
        >
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em] chrome-text">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Nav />
          <div className="hidden sm:block">
            <Button href="/#newsletter" size="sm">
              Suscríbete
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
