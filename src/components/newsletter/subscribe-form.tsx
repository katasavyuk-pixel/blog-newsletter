"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markSubscribed } from "@/lib/achievement-state";
import { cn } from "@/lib/utils";
import { TurnstileWidget } from "./turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type FormState = "idle" | "loading" | "done" | "preview" | "error";
type Tone = "light" | "dark";
type Layout = "inline" | "stacked";

/** Presentation classes per surface — logic/state machine are tone-agnostic. */
const tones: Record<Tone, { input: string; help: string; link: string; status: string }> = {
  light: {
    input: "border-border bg-bg text-fg placeholder:text-muted",
    help: "text-muted",
    link: "text-accent-ink underline",
    status: "text-accent-ink",
  },
  dark: {
    input: "border-dark-border-2 bg-dark-input text-on-dark placeholder:text-on-dark-faint",
    help: "text-on-dark-muted",
    link: "text-salmon underline",
    status: "text-salmon",
  },
};

/**
 * Newsletter capture form (footer, home, /recursos, embeddable).
 * Posts to /api/subscribe → double opt-in. `resource` turns it into a lead-magnet
 * capture (source becomes `lead_magnet:<resource>`). `tone` adapts presentation to
 * light cream or dark espresso surfaces; `layout` stacks the field + button.
 */
export function SubscribeForm({
  source = "footer",
  resource,
  tone = "light",
  layout = "inline",
}: {
  source?: string;
  resource?: string;
  tone?: Tone;
  layout?: Layout;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const inputId = `newsletter-email-${source}`;
  const t = tones[tone];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = event.currentTarget;
    const turnstileToken =
      (form.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)
        ?.value || undefined;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, resource, turnstileToken }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { preview?: boolean };
      markSubscribed();
      setState(data.preview ? "preview" : "done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("text-sm", t.status)} role="status">
        ¡Casi! Revisa tu correo y confirma la suscripción (doble opt-in).
      </p>
    );
  }

  if (state === "preview") {
    return (
      <p className={cn("text-sm", t.status)} role="status">
        Formulario conectado ✓ — modo previsualización. Configura Supabase y Resend
        para enviar el email de confirmación real.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-source={source} className="flex flex-col gap-3">
      <div className={cn("flex flex-col gap-2", layout === "inline" && "sm:flex-row")}>
        <label htmlFor={inputId} className="sr-only">
          Correo electrónico
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className={cn(
            "h-11 w-full rounded-xl border px-4 text-sm",
            t.input,
          )}
        />
        <Button type="submit" size="md" disabled={state === "loading"}>
          {state === "loading" ? "Enviando…" : "Suscribirme"}
        </Button>
      </div>

      {TURNSTILE_SITE_KEY ? <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} /> : null}

      <label className={cn("flex items-start gap-2 text-xs leading-relaxed", t.help)}>
        <input
          type="checkbox"
          required
          className="mt-0.5 accent-[var(--color-accent)]"
        />
        <span>
          Acepto recibir la newsletter y la{" "}
          <a href="/privacidad" className={t.link}>
            política de privacidad
          </a>
          . Te enviaremos un email para confirmar tu suscripción (doble opt-in).
        </span>
      </label>

      {state === "error" ? (
        <p className="text-sm text-danger" role="alert">
          Algo falló. Inténtalo de nuevo en un momento.
        </p>
      ) : null}
    </form>
  );
}
