import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { navLinks, siteConfig } from "@/config/site";

/** Espresso footer: brand + newsletter capture, navigation columns, legal bar. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-on-dark-muted">
      <Container
        size="wide"
        className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]"
      >
        <div className="max-w-sm">
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
          <p className="mt-4 text-sm leading-relaxed text-on-dark-faint">
            {siteConfig.newsletter.description}
          </p>
          <div className="mt-5">
            <SubscribeForm source="footer" tone="dark" />
          </div>
        </div>

        <nav aria-label="Navegación" className="flex flex-col gap-2.5">
          <span className="font-display text-xs uppercase tracking-[0.18em] text-on-dark-faint">
            Navegación
          </span>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5">
          <span className="font-display text-xs uppercase tracking-[0.18em] text-on-dark-faint">
            Más
          </span>
          <a
            href="/feed.xml"
            className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
          >
            RSS
          </a>
          <Link
            href="/privacidad"
            className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
          >
            Privacidad
          </Link>
          {siteConfig.social.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
            >
              {item.label}
            </a>
          ))}
        </div>
      </Container>

      <div className="border-t border-dark-border">
        <Container
          size="wide"
          className="flex flex-col gap-2 py-6 font-display text-xs text-on-dark-faint sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {year} {siteConfig.name}.
          </p>
          <p className="font-mono">
            <span aria-hidden className="text-salmon">
              ▸{" "}
            </span>
            construido en público · build{" "}
            {new Date().toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </Container>
      </div>
    </footer>
  );
}
