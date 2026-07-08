import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;

const headingSizes: Record<HeadingLevel, string> = {
  1: "text-4xl sm:text-5xl font-bold",
  2: "text-3xl sm:text-4xl font-bold",
  3: "text-2xl font-bold",
  4: "text-xl font-bold",
};

/** Display heading (Newsreader serif, weight 500) with balanced wrapping. */
export function Heading({
  level = 2,
  className,
  children,
}: {
  level?: HeadingLevel;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    <Tag
      className={cn(
        "font-display tracking-tight text-fg text-balance",
        headingSizes[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Body paragraph (Inter) with comfortable line-height. */
export function Text({
  muted = false,
  className,
  children,
}: {
  muted?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-body leading-relaxed",
        muted ? "text-muted" : "text-fg",
        className,
      )}
    >
      {children}
    </p>
  );
}
