"use client";

import { useEffect, useState } from "react";
import { markPostRead } from "@/lib/achievement-state";

export function useReadingProgress(slug: string) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const onScroll = () => {
      const { top, height } = article.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const total = height - winHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.max(0, Math.round(((winHeight - top) / total) * 100)));
      setProgress(pct);
      if (pct >= 80 && !isComplete) {
        setIsComplete(true);
        markPostRead(slug);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, isComplete]);

  return { progress, isComplete };
}
