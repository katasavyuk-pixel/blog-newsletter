import { cn } from "@/lib/utils";

/**
 * The site's mascot: an ember "core" with eyes — a warm, living spark that
 * guides you through the entry wizard. Pure presentational component (CSS
 * animations, no motion/motion), in the brand red only. Reduced-motion users
 * get the static glow via the global reduced-motion reset.
 *
 * `size="lg"` is the hero version used by the cinematic entrance.
 */
export function Mascot({
  name,
  className,
  size = "md",
}: {
  name: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const lg = size === "lg";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        lg ? "h-32 w-32" : "h-20 w-20",
        className,
      )}
    >
      {/* Outer breathing halo */}
      <span className="glow-layer -inset-3 bg-accent/25 glow-pulse" />

      {/* Body: warm-black orb with an ember rim */}
      <div
        className={cn(
          "ember-orb relative flex items-center justify-center rounded-full border border-accent/40 bg-surface-2",
          lg ? "h-24 w-24" : "h-14 w-14",
        )}
      >
        {/* Inner ember tint */}
        <span className="absolute inset-[6px] rounded-full bg-accent/15" />

        {/* Eyes + brow */}
        <div className={cn("relative flex items-end", lg ? "gap-3.5" : "gap-2.5")}>
          <span className={cn("ember-eye rounded-full bg-accent-ink", lg ? "h-3 w-3" : "h-2 w-2")} />
          <span
            className={cn(
              "ember-eye rounded-full bg-accent-ink [animation-delay:0.45s]",
              lg ? "h-3 w-3" : "h-2 w-2",
            )}
          />
        </div>

        {/* A single drifting spark, like the ambient ember field */}
        <span
          className={cn(
            "ember-spark absolute -right-1 top-1 rounded-full bg-coral-soft",
            lg ? "h-2 w-2" : "h-1.5 w-1.5",
          )}
        />
        <span
          className={cn(
            "ember-spark absolute -left-1.5 bottom-2 rounded-full bg-accent-ink [animation-delay:1.2s]",
            lg ? "h-1.5 w-1.5" : "h-1 w-1",
          )}
        />
      </div>

      <span className="sr-only">{name}, el asistente de este sitio</span>
    </div>
  );
}
