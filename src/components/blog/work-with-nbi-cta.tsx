import { Button } from "@/components/ui/button";

/**
 * "Trabaja con NBI" — honest service CTA, reused at the end of a post and on
 * /sistemas. No price or scope is claimed here; that copy is completed once
 * NBI's offer is defined (see src/app/trabaja-con-nbi/page.tsx).
 */
export function WorkWithNbiCta() {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
        NBI
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-fg">
        ¿Tienes un negocio en marcha y quieres algo así implementado?
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Esto es lo mismo que estoy construyendo en NBI. Si quieres que lo
        implemente en tu negocio, cuéntame tu caso.
      </p>
      <div className="mt-4">
        <Button href="/trabaja-con-nbi" size="sm">
          Trabaja con NBI →
        </Button>
      </div>
    </div>
  );
}
