"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const xUrl = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — ignore.
    }
  }

  const itemClass =
    "rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-fg";

  // Lives in the sticky rail now, so it wraps in ~16rem instead of stretching
  // across the column. At the foot of the article it was one of four stacked
  // blocks all competing for the same moment of attention.
  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-faint">
        Compartir
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={xUrl} target="_blank" rel="noopener noreferrer" className={itemClass}>
          X
        </a>
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={itemClass}>
          LinkedIn
        </a>
        <button type="button" onClick={copyLink} className={itemClass}>
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </button>
      </div>
    </div>
  );
}
