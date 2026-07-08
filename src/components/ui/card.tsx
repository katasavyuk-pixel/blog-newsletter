import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Surface card with brand border and subtle elevation. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-bg p-6 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
