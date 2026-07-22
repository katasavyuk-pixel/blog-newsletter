import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Nav } from "./nav";
import { siteConfig } from "@/config/site";

/** Sticky espresso-glass header: brand mark, primary nav and a newsletter CTA. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-dark-border bg-space/85 text-on-dark backdrop-blur-md">
      <Container size="wide" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.name} — inicio`}
        >
          <span
            aria-hidden
            className="h-4 w-4 rotate-45 rounded-[3px] bg-accent"
            style={{ boxShadow: "0 0 16px var(--color-glow-coral)" }}
          />
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em] chrome-text">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Nav />
          <div className="hidden sm:block">
            <Button href="/#senal" size="sm">
              Suscríbete
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
