"use client";

import { TAU, polar, type Astro } from "@/config/universe";
import { COURSE_PROGRESS_KEY } from "@/config/course";
import { useLocalState } from "@/hooks/use-local-state";
import { cn } from "@/lib/utils";

/**
 * One celestial object on the map. Every astro is a real <button> (focusable,
 * labelled) positioned in world coordinates; activating it opens its focus
 * panel — navigation to the station happens from the panel's CTA. Visuals are
 * pure CSS per kind; global reduced-motion rules freeze every animation.
 */

/** Mini-star layout inside the constellation (deterministic zig-zag arc). */
function lessonPos(index: number, count: number) {
  const angle = (index / count) * TAU - 1.95;
  return polar(index % 2 === 0 ? 46 : 68, angle);
}

/**
 * The course constellation — its stars IGNITE with the reader's real progress
 * (same localStorage the course pages write), so the map itself is the
 * progress bar. Lit stars burn crimson with a glow; unlit stay dim chrome.
 */
function ConstellationVisual({ astro }: { astro: Astro }) {
  const [progress] = useLocalState<Record<string, boolean>>(COURSE_PROGRESS_KEY, {});
  const s = astro.size;
  const stars = astro.stars ?? [];

  return (
    <span aria-hidden className="relative block" style={{ width: s, height: s }}>
      <svg
        viewBox={`${-s / 2} ${-s / 2} ${s} ${s}`}
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <polyline
          points={stars
            .map((_, i) => {
              const p = lessonPos(i, stars.length || 6);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="var(--color-map-line)"
          strokeWidth="1"
        />
        {stars.map((star, i) => {
          const p = lessonPos(i, stars.length || 6);
          const lit = !!progress[star.slug];
          return (
            <circle
              key={star.slug}
              cx={p.x}
              cy={p.y}
              r={lit ? 5 : 4}
              fill={lit ? "var(--color-accent-ink)" : "var(--color-star-dim)"}
              className="astro-twinkle"
              style={{
                animationDelay: `${i * 0.7}s`,
                filter: lit ? "drop-shadow(0 0 6px var(--color-accent))" : undefined,
              }}
            />
          );
        })}
      </svg>
    </span>
  );
}

function Visual({ astro }: { astro: Astro }) {
  const s = astro.size;

  switch (astro.kind) {
    case "nucleo":
      return (
        <span
          aria-hidden
          className="block rounded-full border border-[var(--color-map-line)]"
          style={{
            width: s,
            height: s,
            background:
              "radial-gradient(circle at 42% 38%, var(--color-accent) 0%, var(--color-accent-strong) 42%, rgba(122,22,32,0.25) 68%, transparent 78%)",
            boxShadow:
              "0 0 60px var(--color-glow-coral), inset 0 0 26px rgba(0,0,0,0.5)",
          }}
        />
      );

    case "constelacion":
      return <ConstellationVisual astro={astro} />;

    case "protoestrella":
      return (
        <span
          aria-hidden
          className="proto-breathe block rounded-full"
          style={{
            width: s,
            height: s,
            background:
              "radial-gradient(circle, var(--color-nebula-core) 0%, var(--color-nebula-far) 45%, transparent 72%)",
            filter: "blur(1px)",
          }}
        />
      );

    case "pulsar":
      return (
        <span aria-hidden className="relative block" style={{ width: s, height: s }}>
          <span
            className="pulsar-beam absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(242,85,94,0.5) 0deg, transparent 70deg, transparent 360deg)",
            }}
          />
          <span className="absolute inset-0 rounded-full border border-[var(--color-map-line)]" />
          <span
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-salmon"
            style={{ boxShadow: "0 0 14px var(--color-glow-coral)" }}
          />
        </span>
      );

    case "baliza":
      return (
        <span
          aria-hidden
          className="glow-pulse block rotate-45 rounded-[6px] bg-accent"
          style={{
            width: s * 0.55,
            height: s * 0.55,
            boxShadow: "0 0 34px var(--color-glow-coral), 0 0 90px var(--color-glow-coral)",
          }}
        />
      );

    case "cometa": {
      const deg = (Math.atan2(astro.y, astro.x) * 180) / Math.PI;
      return (
        <span aria-hidden className="relative block" style={{ width: s, height: s }}>
          <span
            className="absolute left-1/2 top-1/2 h-px w-12 origin-left"
            style={{
              transform: `rotate(${deg}deg)`,
              background: "linear-gradient(90deg, var(--color-star-dim), transparent)",
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-star"
            style={{ boxShadow: "0 0 10px rgba(245,246,248,0.7)" }}
          />
        </span>
      );
    }

    case "sonda":
      return (
        <span
          aria-hidden
          className="flex items-center justify-center rounded-full border border-[var(--color-map-line)] bg-surface font-mono text-sm text-salmon"
          style={{ width: s, height: s, boxShadow: "0 0 18px rgba(0,0,0,0.6)" }}
        >
          ▶
        </span>
      );

    default:
      // sistema — a lit star with its glyph.
      return (
        <span
          aria-hidden
          className="flex items-center justify-center rounded-full font-mono text-base text-fg"
          style={{
            width: s,
            height: s,
            background:
              "radial-gradient(circle at 45% 40%, rgba(245,246,248,0.22) 0%, rgba(215,33,42,0.35) 55%, transparent 75%)",
            boxShadow: "0 0 24px var(--color-glow-coral)",
          }}
        >
          {astro.glyph}
        </span>
      );
  }
}

export function AstroNode({
  astro,
  selected,
  onSelect,
  onFocusAstro,
}: {
  astro: Astro;
  selected: boolean;
  onSelect: (astro: Astro) => void;
  onFocusAstro: (astro: Astro) => void;
}) {
  const major = astro.kind !== "cometa";

  return (
    <button
      type="button"
      onClick={() => onSelect(astro)}
      onFocus={() => onFocusAstro(astro)}
      aria-label={`${astro.name}${astro.sub ? ` — ${astro.sub}` : ""}`}
      className={cn(
        "group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 rounded-xl p-2 transition-transform duration-300 hover:scale-105 focus-visible:scale-105",
        selected && "scale-105",
      )}
      style={{ left: astro.x, top: astro.y }}
    >
      <Visual astro={astro} />
      <span
        className={cn(
          "pointer-events-none flex flex-col items-center gap-0.5 text-center",
          astro.kind === "nucleo" ? "w-56" : "w-44",
          !major &&
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        <span
          className={cn(
            "font-punch uppercase leading-tight tracking-wide text-fg",
            astro.kind === "nucleo" ? "text-2xl" : major ? "text-base" : "text-xs",
          )}
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
        >
          {astro.name}
        </span>
        {astro.sub ? (
          <span className="font-mono text-[10px] tracking-wide text-muted">
            {astro.sub}
          </span>
        ) : null}
      </span>
    </button>
  );
}
