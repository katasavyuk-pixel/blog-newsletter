import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warn";

const styles: Record<CalloutType, { border: string; icon: string }> = {
  info: { border: "border-l-accent", icon: "ℹ" },
  tip: { border: "border-l-accent-strong", icon: "✦" },
  warn: { border: "border-l-danger", icon: "▲" },
};

/** Editorial callout box (server component — no interactivity). */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[type];
  return (
    <aside
      className={cn(
        "not-prose my-6 rounded-r-xl border border-l-4 border-border bg-surface p-4",
        s.border,
      )}
    >
      {title ? (
        <p className="mb-1 flex items-center gap-2 font-display font-semibold text-fg">
          <span aria-hidden className="text-accent-ink">
            {s.icon}
          </span>
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-relaxed text-fg">{children}</div>
    </aside>
  );
}
