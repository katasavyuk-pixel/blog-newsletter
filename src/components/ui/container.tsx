import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centered page container with consistent horizontal padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
