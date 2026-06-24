"use client";

import { useId } from "react";

/** Accessible labelled slider control. Native range input = keyboard + ARIA for free. */
export function Param({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={id} className="font-medium text-fg">
          {label}
        </label>
        <span className="font-mono tabular-nums text-accent-ink">
          {format ? format(value) : value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}
