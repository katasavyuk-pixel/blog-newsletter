import { cn } from "@/lib/utils";

/**
 * Branded gradient stand-in for imagery we don't have yet (hero portrait,
 * about avatar, featured-post thumbnail). A dark espresso card lit by a coral→
 * amber sunset gradient with a Newsreader monogram — on-brand, honest, no
 * fake photo. A real photo / `cover` can replace it later without layout change.
 */
export function BrandVisual({
  label = "KI",
  caption,
  className,
  rounded = "rounded-2xl",
  labelClassName = "text-6xl",
}: {
  label?: string;
  caption?: string;
  className?: string;
  rounded?: string;
  labelClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden bg-dark",
        rounded,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 75% 15%, var(--color-glow-coral), transparent 55%), radial-gradient(120% 100% at 10% 95%, var(--color-glow-amber), transparent 60%)",
        }}
      />
      <span
        aria-hidden
        className={cn(
          "relative font-display font-medium italic text-on-dark/90",
          labelClassName,
        )}
      >
        {label}
      </span>
      {caption ? (
        <span className="absolute bottom-3 left-3 rounded-xl border border-dark-border-2 bg-dark/80 px-3 py-1.5 font-mono text-xs text-salmon backdrop-blur">
          {caption}
        </span>
      ) : null}
    </div>
  );
}
