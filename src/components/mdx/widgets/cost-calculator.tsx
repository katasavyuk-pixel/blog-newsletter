"use client";

import { useState } from "react";
import { Param } from "./param";
import { WidgetFrame } from "./widget-frame";

// Approximate public prices in $/million tokens (input / output). Editable.
const MODELS = [
  { id: "gpt-4o-mini", label: "GPT-4o mini", in: 0.15, out: 0.6 },
  { id: "gpt-4o", label: "GPT-4o", in: 2.5, out: 10 },
  { id: "claude-haiku", label: "Claude Haiku", in: 0.8, out: 4 },
  { id: "claude-sonnet", label: "Claude Sonnet", in: 3, out: 15 },
];

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-0.5 font-display text-lg font-bold tabular-nums ${accent ? "text-accent-ink" : "text-fg"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function CostCalculator() {
  const [modelId, setModelId] = useState("gpt-4o-mini");
  const [inTok, setInTok] = useState(800);
  const [outTok, setOutTok] = useState(400);
  const [reqs, setReqs] = useState(1000);

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const perReq = (inTok * model.in + outTok * model.out) / 1_000_000;
  const perDay = perReq * reqs;
  const perMonth = perDay * 30;

  return (
    <WidgetFrame
      title="Coste"
      onReset={() => {
        setModelId("gpt-4o-mini");
        setInTok(800);
        setOutTok(400);
        setReqs(1000);
      }}
      caption="Estimación con precios públicos aproximados ($/millón de tokens). Fíjate en cómo el coste de salida y la elección de modelo dominan la factura."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cost-model" className="text-sm font-medium text-fg">
            Modelo
          </label>
          <select
            id="cost-model"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="rounded-full border border-border bg-bg px-3 py-1.5 text-sm text-fg"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} (${m.in} / ${m.out} por M)
              </option>
            ))}
          </select>
        </div>
        <Param label="Tokens de entrada" value={inTok} min={0} max={8000} step={100} onChange={setInTok} />
        <Param label="Tokens de salida" value={outTok} min={0} max={4000} step={100} onChange={setOutTok} />
        <Param label="Peticiones / día" value={reqs} min={0} max={50000} step={100} onChange={setReqs} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Por petición" value={`$${perReq.toFixed(5)}`} />
        <Stat label="Por día" value={`$${perDay.toFixed(2)}`} />
        <Stat label="Por mes" value={`$${perMonth.toFixed(0)}`} accent />
      </div>
    </WidgetFrame>
  );
}
