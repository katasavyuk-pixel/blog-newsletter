"use client";

import { useState } from "react";
import { markShared } from "@/lib/achievement-state";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const xUrl = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      markShared();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — ignore.
    }
  }

  const itemClass =
    "rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg";

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6">
      <span className="text-sm font-medium text-fg">¿Te ha servido? Compártelo:</span>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className={itemClass} onClick={() => markShared()}>
        X
      </a>
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={itemClass} onClick={() => markShared()}>
        LinkedIn
      </a>
      <button type="button" onClick={copyLink} className={itemClass}>
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
