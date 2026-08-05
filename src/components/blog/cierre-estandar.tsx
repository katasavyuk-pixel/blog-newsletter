import Link from "next/link";
import { CIERRE_SALIDAS, salidaDestacada, type SalidaId } from "@/config/cierre";
import { cn } from "@/lib/utils";

/**
 * The three fixed exits at the end of every article.
 *
 * Always all three, always in this order. `destacada` only changes emphasis —
 * see src/config/cierre.ts for why the old one-of-three switch was replaced.
 */
export function CierreEstandar({ formato }: { formato: string }) {
  const destacada: SalidaId = salidaDestacada(formato);

  return (
    <section
      aria-labelledby="cierre"
      className="not-prose mt-14 border-t border-border pt-8"
    >
      <h2
        id="cierre"
        className="font-mono text-xs uppercase tracking-[0.2em] text-faint"
      >
        Por dónde seguir
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {CIERRE_SALIDAS.map((salida) => {
          const activa = salida.id === destacada;
          const externa = salida.href.startsWith("mailto:");
          const Etiqueta = externa ? "a" : Link;
          return (
            <li
              key={salida.id}
              data-cierre={salida.id}
              className={cn(
                "flex flex-col rounded-2xl border p-5",
                activa
                  ? "border-accent-ink/50 bg-surface"
                  : "border-border bg-bg",
              )}
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-accent-ink">
                {salida.kicker}
              </p>
              <p className="mt-2 font-display text-base font-semibold text-fg">
                {salida.titulo}
              </p>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                {salida.descripcion}
              </p>
              <Etiqueta
                href={salida.href}
                className="mt-4 font-mono text-sm text-accent-ink hover:underline"
              >
                ▸ {salida.accion}
              </Etiqueta>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
