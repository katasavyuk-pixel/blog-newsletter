"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "./turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type FormState = "idle" | "loading" | "done" | "preview" | "error";

/**
 * Newsletter capture form (footer, /recursos, embeddable).
 * Posts to /api/subscribe → double opt-in. `resource` turns it into a lead-magnet
 * capture (source becomes `lead_magnet:<resource>`).
 */
export function SubscribeForm({
  source = "footer",
  resource,
}: {
  source?: string;
  resource?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const inputId = `newsletter-email-${source}`;

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
      setState(data.preview ? "preview" : "done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm text-accent-ink" role="status">
        ¡Casi! Revisa tu correo y confirma la suscripción (doble opt-in).
      </p>
    );
  }

  if (state === "preview") {
    return (
      <p className="text-sm text-accent-ink" role="status">
        Formulario conectado ✓ — modo previsualización. Configura Supabase y Resend
        para enviar el email de confirmación real.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-source={source} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
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
          className="h-11 w-full rounded-full border border-border bg-bg px-4 text-sm text-fg placeholder:text-muted"
        />
        <Button type="submit" size="md" disabled={state === "loading"}>
          {state === "loading" ? "Enviando…" : "Suscribirme"}
        </Button>
      </div>

      {TURNSTILE_SITE_KEY ? <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} /> : null}

      <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          required
          className="mt-0.5 accent-[var(--color-accent)]"
        />
        <span>
          Acepto recibir la newsletter y la{" "}
          <a href="/privacidad" className="text-accent-ink underline">
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
