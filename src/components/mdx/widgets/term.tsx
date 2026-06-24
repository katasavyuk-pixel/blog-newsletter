"use client";

import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { glossary } from "@/lib/glossary";

/**
 * Hover/focus glossary popover for AI jargon. Accessible by construction
 * (Radix: keyboard-focusable, Esc to dismiss). Serves the mixed audience —
 * non-devs get instant definitions, devs aren't slowed down.
 */
export function Term({ id, children }: { id: string; children: ReactNode }) {
  const entry = glossary[id];
  if (!entry) return <>{children}</>;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="cursor-help font-medium text-accent-ink underline decoration-dotted decoration-from-font underline-offset-4"
        >
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-w-xs rounded-xl border border-border bg-bg p-3.5 text-left shadow-[0_8px_30px_rgba(16,32,58,0.12)]"
        >
          <p className="font-display text-sm font-semibold text-fg">
            {entry.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{entry.def}</p>
          <Popover.Arrow className="fill-[var(--color-border)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
