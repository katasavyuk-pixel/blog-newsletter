import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Nav } from "./nav";
import { siteConfig } from "@/config/site";

/** Sticky site header with brand mark, primary nav and a lead-magnet CTA. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.name} — inicio`}
        >
          <span
            aria-hidden
            className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-strong)] shadow-[0_0_12px_-2px_var(--color-accent)]"
          />
          <span className="font-display text-lg font-bold tracking-tight text-fg">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Nav />
          <Button href="/recursos" size="sm">
            Recursos gratis
          </Button>
        </div>
      </Container>
    </header>
  );
}
