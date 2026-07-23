"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import type { Astro } from "@/config/universe";

/** CTA label per destination — the act of leaving the map is "landing". */
function ctaLabel(astro: Astro): string {
  switch (astro.kind) {
    case "nucleo":
      return "Ver el origen →";
    case "constelacion":
      return "Empezar el curso →";
    case "pulsar":
      return "Leer el radar →";
    case "sonda":
      return "Ver los vídeos →";
    default:
      return "Aterrizar →";
  }
}

/**
 * Focus panel for the selected astro: name, honest sub-line, payload
 * (lessons / headlines / formation progress) and the landing CTA. La Señal
 * renders the real capture form here (form nº 2, source `senal-mapa`).
 * Non-modal dialog docked to the bottom of the map; Esc or ✕ closes.
 */
export function AstroPanel({
  astro,
  onClose,
  onSelectAstro,
}: {
  astro: Astro | null;
  onClose: () => void;
  onSelectAstro: (id: string) => void;
}) {
  useEffect(() => {
    if (!astro) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [astro, onClose]);

  if (!astro) return null;

  return (
    <div
      role="dialog"
      aria-label={astro.name}
      className="absolute inset-x-3 bottom-16 z-30 mx-auto max-w-md rounded-2xl border border-dark-border-2 bg-dark/95 p-5 text-on-dark shadow-card-hover backdrop-blur-md sm:inset-x-auto sm:bottom-4 sm:right-20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-punch text-xl uppercase tracking-wide">{astro.name}</h2>
          {astro.sub ? (
            <p className="mt-1 font-mono text-[11px] tracking-wide text-on-dark-muted">
              ▸ {astro.sub}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar panel"
          className="rounded-full border border-dark-border-2 px-2.5 py-1 font-mono text-xs text-on-dark-muted transition-colors hover:text-on-dark"
        >
          ✕
        </button>
      </div>

      {astro.blurb ? (
        <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">{astro.blurb}</p>
      ) : null}

      {astro.kind === "constelacion" && astro.stars ? (
        <ol className="mt-3 flex flex-col gap-1.5">
          {astro.stars.map((star) => (
            <li key={star.slug} className="flex items-center gap-2 font-mono text-xs text-on-dark-muted">
              <span aria-hidden className="text-salmon">
                {star.glyph}
              </span>
              {star.title}
            </li>
          ))}
        </ol>
      ) : null}

      {astro.kind === "pulsar" && astro.blips?.length ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {astro.blips.map((blip) => (
            <li key={blip.url} className="flex gap-2 text-xs leading-snug text-on-dark-muted">
              <span aria-hidden className="font-mono text-salmon">
                ◉
              </span>
              <a
                href={blip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-on-dark"
              >
                {blip.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {astro.kind === "protoestrella" ? (
        <div className="mt-3">
          <div
            role="progressbar"
            aria-valuenow={astro.progress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Formación"
            className="h-1.5 overflow-hidden rounded-full bg-dark-input"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${astro.progress ?? 0}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => onSelectAstro("senal")}
            className="mt-3 font-mono text-xs text-salmon underline underline-offset-4 transition-colors hover:text-on-dark"
          >
            ▸ La Señal te avisa cuando se encienda
          </button>
        </div>
      ) : null}

      {astro.kind === "baliza" ? (
        <div className="mt-4">
          <SubscribeForm source="senal-mapa" tone="dark" layout="stacked" />
        </div>
      ) : null}

      {astro.href ? (
        <Link
          href={astro.href}
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-accent px-4 font-display text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
        >
          {ctaLabel(astro)}
        </Link>
      ) : null}
    </div>
  );
}
