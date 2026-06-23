"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Newsletter capture UI (footer + embeddable).
 *
 * Fase 0 PLACEHOLDER: renders the full RGPD-ready form (email + explicit
 * consent + privacy link) but does NOT submit anywhere yet. The real
 * double opt-in flow (POST /api/subscribe → Resend → Supabase) lands in Fase 2.
 * `source` is captured now so Fase 2 can persist it on the subscriber row.
 */
export function SubscribeForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputId = `newsletter-email-${source}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Placeholder only — no network call until Fase 2.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-accent-ink" role="status">
        ¡Gracias! La newsletter se activa en la Fase 2 — de momento esto es una
        previsualización del formulario.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-source={source}
      className="flex flex-col gap-3"
    >
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
        <Button type="submit" size="md">
          Suscribirme
        </Button>
      </div>
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
    </form>
  );
}
