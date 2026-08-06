import { cn } from "@/lib/utils";

/**
 * Every part of Chispa, per size.
 *
 * `md` and `lg` are exactly the values that were here as nested ternaries.
 * `hero` exists so the entry wizard reaches its close-up by scaling *down* from
 * a native 360px rather than blowing a 128px box up past ×4. Both looked fine
 * when measured at 2× device scale, so this is not fixing an observed bug — it
 * removes the dependency on the browser choosing to re-rasterise a layer it has
 * every right to just stretch, in the one shot whose whole point is that she is
 * sharp until the moment she defocuses.
 */
const SIZES = {
  md: {
    box: "h-20 w-20",
    halo: "-inset-3",
    orb: "h-14 w-14",
    tint: "inset-[6px]",
    gap: "gap-2.5",
    eye: "h-2 w-2",
    sparkA: "h-1.5 w-1.5 -right-1 top-1",
    sparkB: "h-1 w-1 -left-1.5 bottom-2",
  },
  lg: {
    box: "h-32 w-32",
    halo: "-inset-3",
    orb: "h-24 w-24",
    tint: "inset-[6px]",
    gap: "gap-3.5",
    eye: "h-3 w-3",
    sparkA: "h-2 w-2 -right-1 top-1",
    sparkB: "h-1.5 w-1.5 -left-1.5 bottom-2",
  },
  hero: {
    box: "h-[360px] w-[360px]",
    halo: "-inset-8",
    orb: "h-[270px] w-[270px]",
    tint: "inset-[17px]",
    gap: "gap-[39px]",
    eye: "h-[34px] w-[34px]",
    sparkA: "h-[22px] w-[22px] -right-3 top-3",
    sparkB: "h-[17px] w-[17px] -left-4 bottom-6",
  },
} as const;

/**
 * The site's mascot: an ember "core" with eyes — a warm, living spark that
 * guides you through the entry wizard. Pure presentational component (CSS
 * animations, no motion/motion), in the brand red only. Reduced-motion users
 * get the static glow via the global reduced-motion reset.
 *
 * `size="lg"` is the one the Radar scene sweeps across; `size="hero"` is the
 * cinematic entrance, which starts tiny and grows into it.
 */
export function Mascot({
  name,
  className,
  size = "md",
}: {
  name: string;
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        s.box,
        className,
      )}
    >
      {/* Outer breathing halo.
          `--mascot-halo` rides on a wrapper rather than on the pulsing element
          itself: a CSS animation on `opacity` outranks an inline style, so
          `glow-pulse` would swallow the variable whole. Nested, the two
          multiply. The entry wizard drives it to 0 before it applies a blur of
          its own — this halo carries `filter: blur(80px)`, and a filter on an
          ancestor re-blurs the already-rasterised subtree. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: "var(--mascot-halo, 1)" }}
      >
        <span className={cn("glow-layer bg-accent/25 glow-pulse", s.halo)} />
      </span>

      {/* Body: warm-black orb with an ember rim */}
      <div
        className={cn(
          "ember-orb relative flex items-center justify-center rounded-full border border-accent/40 bg-surface-2",
          s.orb,
        )}
      >
        {/* Inner ember tint */}
        <span className={cn("absolute rounded-full bg-accent/15", s.tint)} />

        {/* Eyes + brow */}
        <div className={cn("relative flex items-end", s.gap)}>
          <span className={cn("ember-eye rounded-full bg-accent-ink", s.eye)} />
          <span
            className={cn(
              "ember-eye rounded-full bg-accent-ink [animation-delay:0.45s]",
              s.eye,
            )}
          />
        </div>

        {/* A single drifting spark, like the ambient ember field */}
        <span
          className={cn(
            "ember-spark absolute rounded-full bg-coral-soft",
            s.sparkA,
          )}
        />
        <span
          className={cn(
            "ember-spark absolute rounded-full bg-accent-ink [animation-delay:1.2s]",
            s.sparkB,
          )}
        />
      </div>

      <span className="sr-only">{name}, el asistente de este sitio</span>
    </div>
  );
}
