"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type EncModule = {
  encode: (text: string) => number[];
  decode: (ids: number[]) => string;
};

const DEFAULT_TEXT = "Aprende IA de verdad, sin humo.";

/**
 * The hero IS the demo: a live, compact tokenizer the visitor can type into
 * within 3 seconds of landing — the brand promise ("IA que se toca") made
 * pixels. Slim sibling of TokenizerPlayground (same on-demand BPE load).
 */
export function HeroTokenizer() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [enc, setEnc] = useState<EncModule | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    import("gpt-tokenizer/encoding/o200k_base").then((m) =>
      setEnc({ encode: m.encode, decode: m.decode }),
    );
  }, []);

  const tokens = useMemo(() => {
    if (!enc || !text) return [];
    return enc.encode(text).map((id) => ({ id, text: enc.decode([id]) }));
  }, [enc, text]);

  return (
    <div className="relative rounded-3xl border border-dark-border-2 bg-dark-input/60 p-5 shadow-card sm:p-6">
      <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-on-dark-faint">
        <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
        EN VIVO — así lee un modelo tu frase
      </p>

      <label htmlFor="hero-tok-input" className="sr-only">
        Escribe algo y mira cómo la IA lo parte en tokens
      </label>
      <textarea
        id="hero-tok-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={2}
        spellCheck={false}
        enterKeyHint="done"
        className="mt-4 w-full resize-none rounded-xl border border-dark-border-2 bg-dark-input p-3 font-mono text-sm text-on-dark placeholder:text-on-dark-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        placeholder="Escribe aquí lo que quieras…"
      />

      <div className="mt-4 flex min-h-[5.5rem] flex-wrap content-start gap-1 rounded-xl border border-dark-border bg-dark p-3">
        {!enc ? (
          <span className="font-mono text-xs text-on-dark-faint">
            cargando tokenizador…
          </span>
        ) : tokens.length === 0 ? (
          <span className="font-mono text-xs text-on-dark-faint">
            escribe algo arriba ↑
          </span>
        ) : (
          tokens.map((token, i) => (
            <span
              key={i}
              className={cn("tok-chip text-on-dark", `tok-${i % 4}`)}
              title={`token id ${token.id}`}
            >
              {token.text === ""
                ? "∅"
                : token.text.replace(/ /g, "·").replace(/\n/g, "↵")}
            </span>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 font-mono text-xs text-on-dark-faint">
        <span>
          <strong className="text-base text-on-dark">{tokens.length}</strong>{" "}
          tokens
        </span>
        <Link
          href="/blog/que-es-un-token"
          className="text-salmon hover:underline"
        >
          ¿por qué se parte así? →
        </Link>
      </div>
    </div>
  );
}
