"use client";

import { useEffect, useRef, useState } from "react";
import { useLocalState } from "@/hooks/use-local-state";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The entry cinematic (spec §entrada): black + logo → warp flight through the
 * starfield → deceleration into a single red ember that blooms crimson → the
 * overlay lifts and the map is there. Doubles as the loading screen — the map
 * mounts beneath it from the first paint.
 *
 * Rules: full sequence only on the FIRST visit (localStorage), skippable from
 * second zero (button, any key, click); returning visits and reduced-motion
 * get a short static fade. The overlay is server-rendered black so first
 * paint never flashes the map before the intro; a <noscript> style on the
 * page hides it entirely without JS.
 */

type Phase = "boot" | "logo" | "flight" | "particle" | "bloom" | "out" | "done";

const INTRO_SEEN_KEY = "universe-intro-seen";

/** Warp-canvas literals (2D context can't read CSS tokens; particle-field precedent). */
const WARP_COLORS = ["#f5f6f8", "#b8bdc6", "#f2555e"];

function WarpCanvas({ speed }: { speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let running = true;

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 0.9 + 0.1,
      color: Math.random() < 0.2 ? 2 : Math.random() < 0.5 ? 0 : 1,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (t: number) => {
      if (!running) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const v = speedRef.current;
      for (const s of stars) {
        const pz = s.z;
        s.z -= v * 0.55 * dt;
        if (s.z <= 0.03) {
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
          s.z = 1;
          continue;
        }
        const px = cx + (s.x / pz) * cx * 0.9;
        const py = cy + (s.y / pz) * cy * 0.9;
        const nx = cx + (s.x / s.z) * cx * 0.9;
        const ny = cy + (s.y / s.z) * cy * 0.9;
        ctx.strokeStyle = WARP_COLORS[s.color];
        ctx.globalAlpha = Math.min(1, (1 - s.z) * 1.2) * 0.85;
        ctx.lineWidth = (1 - s.z) * 2.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
  );
}

export function EntrySequence() {
  const reduced = useReducedMotion();
  const [seen, setSeen] = useLocalState(INTRO_SEEN_KEY, false);
  const [phase, setPhase] = useState<Phase>("boot");

  // Decide after hydration (the timeout keeps the setState out of the effect
  // body, and unlike rAF it also fires in hidden/background tabs): returning
  // visitors and reduced-motion get the short fade, first-timers fly.
  useEffect(() => {
    if (phase !== "boot") return;
    const t = setTimeout(() => {
      setPhase(seen || reduced ? "out" : "logo");
    }, 0);
    return () => clearTimeout(t);
  }, [phase, reduced, seen]);

  // Timeline: each phase schedules the next; skip jumps straight to "out".
  useEffect(() => {
    const next: Partial<Record<Phase, [Phase, number]>> = {
      logo: ["flight", 500],
      flight: ["particle", 2700],
      particle: ["bloom", 700],
      bloom: ["out", 400],
    };
    const step = next[phase];
    if (!step) return;
    const t = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [phase]);

  // Mark as seen once the exit starts, and let any key skip the flight.
  useEffect(() => {
    if (phase === "out" && !seen) setSeen(true);
    if (phase !== "logo" && phase !== "flight" && phase !== "particle") return;
    const onKey = () => setPhase("out");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, seen, setSeen]);

  if (phase === "done") return null;

  const flying = phase === "logo" || phase === "flight" || phase === "particle" || phase === "bloom";

  return (
    <div
      data-entry-overlay
      aria-hidden={!flying}
      className={cn(
        "fixed inset-0 z-[60] bg-space transition-opacity duration-700",
        phase === "out" && "pointer-events-none opacity-0",
      )}
      onClick={() => flying && setPhase("out")}
      onTransitionEnd={() => phase === "out" && setPhase("done")}
    >
      {(phase === "flight" || phase === "particle" || phase === "bloom") && (
        <WarpCanvas speed={phase === "flight" ? 1 : phase === "particle" ? 0.12 : 0} />
      )}

      {phase === "logo" ? (
        <span
          aria-hidden
          className="glow-pulse absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[4px] bg-accent"
          style={{ boxShadow: "0 0 40px var(--color-glow-coral)" }}
        />
      ) : null}

      {phase === "particle" || phase === "bloom" ? (
        <span
          aria-hidden
          className="entry-ember absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent) 0%, var(--color-accent-strong) 45%, transparent 70%)",
          }}
        />
      ) : null}

      {phase === "bloom" ? (
        <span aria-hidden className="entry-bloom absolute inset-0" />
      ) : null}

      {flying && phase !== "bloom" ? (
        <button
          type="button"
          autoFocus
          onClick={(event) => {
            event.stopPropagation();
            setPhase("out");
          }}
          className="absolute right-4 top-4 rounded-full border border-dark-border-2 bg-dark/70 px-4 py-1.5 font-mono text-xs text-on-dark-muted backdrop-blur transition-colors hover:text-on-dark"
        >
          saltar →
        </button>
      ) : null}
    </div>
  );
}
