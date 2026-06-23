import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { navLinks, siteConfig } from "@/config/site";

/** Footer with newsletter capture, navigation and social links. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <Container className="grid gap-12 py-14 md:grid-cols-2">
        <div className="max-w-sm">
          <h2 className="font-display text-xl font-semibold text-fg">
            {siteConfig.newsletter.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {siteConfig.newsletter.description}
          </p>
          <div className="mt-5">
            <SubscribeForm source="footer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:justify-items-end">
          <nav aria-label="Secciones" className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Secciones
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-fg transition-colors hover:text-accent-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {siteConfig.social.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Sígueme
              </span>
              {siteConfig.social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fg transition-colors hover:text-accent-ink"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p>Contenido sobre inteligencia artificial.</p>
        </Container>
      </div>
    </footer>
  );
}
