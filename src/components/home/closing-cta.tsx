import { Container } from "@/components/ui/container";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { LIBRARY_ITEMS } from "@/config/library";
import { siteConfig } from "@/config/site";

/**
 * Closing capture (form #2 of 2) — the saturated crimson climax panel, back
 * from the original design. Sells the FUTURE content of the list (Javi
 * Pastor pattern): the systems in the workshop, straight from library.ts,
 * land in subscribers' inboxes first. The espresso form card floats on the
 * crimson. Keeps the #newsletter anchor every "Suscríbete" button points at.
 */
export function ClosingCta() {
  const upcoming = LIBRARY_ITEMS.filter(
    (item) => item.status === "en-construccion",
  );

  return (
    <section id="newsletter" className="bg-bg py-16 sm:py-24">
      <Container size="wide">
        <div className="relative isolate overflow-hidden rounded-3xl bg-accent px-7 py-14 sm:px-14 sm:py-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(600px 300px at 90% -10%, rgba(255, 255, 255, 0.18), transparent 60%)",
            }}
          />

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-widest text-coral-soft">
                ▸ la newsletter
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium text-on-accent sm:text-5xl">
                Lo próximo que te llevas
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-coral-soft">
                {siteConfig.newsletter.description}
              </p>

              {upcoming.length > 0 ? (
                <ul className="mt-7 flex flex-col gap-3">
                  {upcoming.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/30 font-mono text-xs text-on-accent"
                      >
                        {item.glyph}
                      </span>
                      <span className="text-coral-soft">
                        <strong className="font-semibold text-on-accent">
                          {item.title}
                        </strong>{" "}
                        · {item.format} — en el taller ahora mismo
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-7 flex flex-col gap-3">
                  {siteConfig.newsletter.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dark text-xs text-on-dark"
                      >
                        ✓
                      </span>
                      <span className="text-coral-soft">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-6 font-mono text-xs text-coral-soft/80">
                ▸ los suscriptores lo reciben antes que nadie, con la plantilla
              </p>
            </div>

            <div className="rounded-2xl border border-dark-border-2 bg-dark p-7 shadow-card sm:p-8">
              <h3 className="font-display text-2xl font-medium text-on-dark">
                Suscríbete gratis
              </h3>
              <p className="mt-1 font-display text-xs text-on-dark-faint">
                Cero ruido · cancela cuando quieras
              </p>
              <div className="mt-5">
                <SubscribeForm source="home" tone="dark" layout="stacked" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
