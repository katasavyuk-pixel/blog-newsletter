import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline-dark"
  | "dark-solid"
  | "ghost-coral";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Coral surface, white label — the primary CTA on any background.
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  // Light outline — secondary action on cream surfaces.
  secondary: "border border-border bg-surface text-fg hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface",
  // Outline action sitting on a dark espresso section.
  "outline-dark":
    "border border-dark-border-3 text-on-dark hover:border-outline-hover hover:bg-white/5",
  // Solid espresso — secondary action that must read as "dark".
  "dark-solid": "bg-dark text-on-dark hover:bg-dark-input",
  // Translucent white — secondary action sitting on the coral CTA panel.
  "ghost-coral": "border border-white/35 bg-white/15 text-on-accent hover:bg-white/25",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

/** Button that renders as <button>, internal <Link>, or external <a> based on `href`. */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (/^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
