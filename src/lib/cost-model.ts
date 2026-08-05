/**
 * The arithmetic behind the cost calculator, extracted from the widget.
 *
 * This file has no `"use client"` on purpose. The capture flow stores what a
 * reader calculated and the first onboarding email quotes it back, so both the
 * route handler and the email renderer need these numbers — and neither can
 * import a client component to get them.
 *
 * The server never trusts the figures the browser sends: it re-runs
 * `computeCost` over the validated inputs. An email that quotes a price is
 * making a claim, and a claim assembled from client-supplied numbers is a claim
 * nothing backs.
 */

/** Approximate public prices in $/million tokens (input / output). Editable. */
export const COST_MODELS = [
  { id: "gpt-4o-mini", label: "GPT-4o mini", in: 0.15, out: 0.6 },
  { id: "gpt-4o", label: "GPT-4o", in: 2.5, out: 10 },
  { id: "claude-haiku", label: "Claude Haiku", in: 0.8, out: 4 },
  { id: "claude-sonnet", label: "Claude Sonnet", in: 3, out: 15 },
] as const;

export type CostModel = (typeof COST_MODELS)[number];
export type CostModelId = CostModel["id"];

export const COST_MODEL_IDS = COST_MODELS.map((m) => m.id) as [
  CostModelId,
  ...CostModelId[],
];

/** Slider bounds — shared by the widget and by the server-side validation. */
export const COST_LIMITS = {
  inTok: { min: 0, max: 8000, step: 100 },
  outTok: { min: 0, max: 4000, step: 100 },
  reqs: { min: 0, max: 50000, step: 100 },
} as const;

export const COST_DEFAULTS = {
  modelId: "gpt-4o-mini" as CostModelId,
  inTok: 800,
  outTok: 400,
  reqs: 1000,
};

export type CostInputs = typeof COST_DEFAULTS;

export type CostResult = {
  model: CostModel;
  perReq: number;
  perDay: number;
  perMonth: number;
};

/**
 * Same expression, same order of operations as the widget used inline, so the
 * numbers stay bit-for-bit identical to what the reader saw on screen.
 */
export function computeCost(inputs: CostInputs): CostResult {
  const model = COST_MODELS.find((m) => m.id === inputs.modelId) ?? COST_MODELS[0];
  const perReq = (inputs.inTok * model.in + inputs.outTok * model.out) / 1_000_000;
  const perDay = perReq * inputs.reqs;
  const perMonth = perDay * 30;
  return { model, perReq, perDay, perMonth };
}

/** The three figures as the widget formats them, for reuse in the email. */
export function formatCost(result: CostResult) {
  return {
    perReq: `$${result.perReq.toFixed(5)}`,
    perDay: `$${result.perDay.toFixed(2)}`,
    perMonth: `$${result.perMonth.toFixed(0)}`,
  };
}

/** The magnet slug this calculator captures under. */
export const COST_MAGNET_SLUG = "calculadora-coste-ia";

/**
 * Narrow an untrusted object to `CostInputs`, or null.
 *
 * Used by the route handler before recomputing. Bounds mirror the sliders, so a
 * payload that could not have come from the UI is rejected rather than stored.
 */
export function parseCostInputs(value: unknown): CostInputs | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const modelId = raw.modelId;
  if (typeof modelId !== "string") return null;
  if (!COST_MODELS.some((m) => m.id === modelId)) return null;

  const bounded = (v: unknown, limits: { min: number; max: number }): number | null => {
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    if (!Number.isInteger(v)) return null;
    if (v < limits.min || v > limits.max) return null;
    return v;
  };

  const inTok = bounded(raw.inTok, COST_LIMITS.inTok);
  const outTok = bounded(raw.outTok, COST_LIMITS.outTok);
  const reqs = bounded(raw.reqs, COST_LIMITS.reqs);
  if (inTok === null || outTok === null || reqs === null) return null;

  return { modelId: modelId as CostModelId, inTok, outTok, reqs };
}
