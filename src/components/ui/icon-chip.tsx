import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipColor = "coral" | "navy" | "toffee" | "forest";

const colors: Record<ChipColor, string> = {
  coral: "bg-accent",
  navy: "bg-cat-navy",
  toffee: "bg-cat-toffee",
  forest: "bg-cat-forest",
};

/** Rounded colored square with a centered typographic glyph (resource/showcase cards). */
export function IconChip({
  color = "coral",
  className,
  children,
}: {
  color?: ChipColor;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg text-on-accent",
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
