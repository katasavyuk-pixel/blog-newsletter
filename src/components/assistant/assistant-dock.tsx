"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mascot } from "@/components/wizard/mascot";
import { openIntent } from "@/hooks/use-intent-wizard";
import { COMPANION, QUICK_ACTIONS, type CompanionQuick } from "@/config/assistant";

type Msg = { role: "user" | "assistant"; content: string };
type Status = "idle" | "loading" | "error";

const LINK_CLASS =
  "text-accent-ink underline decoration-accent/40 underline-offset-2 hover:text-fg";

/** Renders the reply as text + clickable links. Understands `[texto](/ruta)`
 * markdown (lo que suele generar la IA) y enlaza también rutas `/...` sueltas. */
function renderReply(text: string) {
  // 1) Cortar por links markdown para no dejar `[]()` sueltos.
  const mdParts = text.split(/(\[[^\]]+\]\(\/[\w\-/]+\))/g);
  return mdParts.map((part, i) => {
    const md = part.match(/^\[([^\]]+)\]\((\/[\w\-/]+)\)$/);
    if (md) {
      return (
        <Link key={i} href={md[2]} className={LINK_CLASS}>
          {md[1]}
        </Link>
      );
    }
    // 2) Fallback: ruta suelta `/algo` dentro de texto plano.
    const chunks = part.split(/(\/[\w\-/]+)/g);
    return chunks.map((chunk, j) =>
      chunk.startsWith("/") && chunk.length > 1 ? (
        <Link key={`${i}-${j}`} href={chunk} className={LINK_CLASS}>
          {chunk}
        </Link>
      ) : (
        <span key={`${i}-${j}`}>{chunk}</span>
      ),
    );
  });
}

/**
 * "Chispa" — el compañero persistente del sitio. Botón flotante abajo a la
 * derecha que abre un panel de chat con un LLM real anclado al contenido del
 * sitio (ver /api/assistant). Vive en el layout, así que acompaña a la gente
 * por todo el blog.
 */
export function AssistantDock() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  async function ask(query: string) {
    if (!query.trim() || status === "loading") return;
    setInput("");
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    const next: Msg[] = [...messages, { role: "user", content: query }];
    setMessages(next);
    setStatus("loading");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string | null;
        unconfigured?: boolean;
      };

      if (data.unconfigured) {
        setMessages((m) => [...m, { role: "assistant", content: COMPANION.offlineMessage }]);
      } else if (data.ok && data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: COMPANION.errorMessage }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: COMPANION.errorMessage }]);
    } finally {
      setStatus("idle");
    }
  }

  function onQuick(q: CompanionQuick) {
    if (q.route) {
      router.push(q.route);
      setOpen(false);
      return;
    }
    void ask(q.ask ?? "");
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={COMPANION.ctaLabel}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-surface-2/95 text-fg shadow-card backdrop-blur transition-colors hover:border-accent/70"
      >
        <Mascot name={COMPANION.name} className="h-12 w-12" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-label={`Chat con ${COMPANION.name}`}
            className="fixed bottom-24 right-5 z-[60] flex h-[min(32rem,72vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-dark-border-2 bg-bg shadow-card-hover"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-dark-border px-4 py-3">
              <Mascot name={COMPANION.name} className="h-11 w-11" />
              <div className="min-w-0 flex-1">
                <p className="font-punch text-lg leading-none text-fg">{COMPANION.name}</p>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  en línea · te ayuda con el blog
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="rounded-lg p-1.5 font-mono text-xs text-faint transition-colors hover:bg-surface hover:text-fg"
              >
                ✕
              </button>
            </div>

            {/* Thread */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <p className="text-sm leading-relaxed text-muted">{COMPANION.greeting}</p>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-sm text-on-accent"
                        : "mr-auto max-w-[92%] rounded-2xl rounded-bl-sm border border-dark-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-fg"
                    }
                  >
                    {m.role === "assistant" ? renderReply(m.content) : m.content}
                  </div>
                ))
              )}

              {status === "loading" ? (
                <div className="mr-auto flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm border border-dark-border bg-surface px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-ink" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-ink [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-ink [animation-delay:240ms]" />
                </div>
              ) : null}
            </div>

            {/* Quick actions. The router goes first and wears the accent: the
                wizard stopped opening itself on arrival, so this and `?wizard=1`
                are the only ways in — see `use-intent-wizard`. */}
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openIntent();
                }}
                className="rounded-full border border-accent/50 px-3 py-1 text-xs text-accent-ink transition-colors hover:border-accent hover:bg-accent/10"
              >
                {COMPANION.routeMeLabel}
              </button>
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => onQuick(q)}
                  className="rounded-full border border-dark-border-2 px-3 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-fg"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Composer */}
            <form
              className="flex items-center gap-2 border-t border-dark-border px-3 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
            >
              <label className="sr-only" htmlFor="chispa-input">
                Pregunta a Chispa
              </label>
              <input
                id="chispa-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={COMPANION.placeholder}
                autoComplete="off"
                className="h-10 flex-1 rounded-xl border border-dark-border-2 bg-dark-input px-3 text-sm text-on-dark placeholder:text-on-dark-faint focus:border-accent/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || status === "loading"}
                aria-label="Enviar"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-on-accent transition-colors hover:bg-accent-strong disabled:opacity-40"
              >
                ↑
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}