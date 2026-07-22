"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { WORLD_RADIUS } from "@/config/universe";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Deep-space background for the star map: two parallax star layers plus
 * crimson nebula washes, drawn on one canvas behind the world plane. Follows
 * the particle-field playbook — pre-rendered sprites (no per-frame blur),
 * DPR cap, visibilitychange pause. Far layers translate at a fraction of the
 * camera and ignore zoom (distant stars barely move — that IS the depth cue).
 * Under reduced motion we draw a single static frame (no twinkle, no rAF).
 */

type Star = { x: number; y: number; size: number; alpha: number; speed: number; phase: number; sprite: number };

/** Canvas-only literals (tokens are unreadable from 2D context; precedent: particle-field). */
const STAR_COLORS = ["#f5f6f8", "#b8bdc6", "#f2555e"];
const NEBULA_COLORS = ["rgba(215, 33, 42, 0.16)", "rgba(122, 22, 32, 0.14)", "rgba(199, 204, 210, 0.05)"];
const DPR_CAP = 2;
const SPREAD = WORLD_RADIUS * 1.7;

/** Fixed nebula washes in world coords (decorative composition constants). */
const NEBULAE = [
  { x: -420, y: -260, r: 620, color: 0 },
  { x: 520, y: 380, r: 720, color: 1 },
  { x: 120, y: -640, r: 520, color: 2 },
  { x: -680, y: 560, r: 560, color: 1 },
];

const LAYERS = [
  { factor: 0.22, count: 240, sizeMax: 1.4, alphaMax: 0.55 },
  { factor: 0.45, count: 140, sizeMax: 2.2, alphaMax: 0.8 },
];

function makeStarSprites(): HTMLCanvasElement[] {
  return STAR_COLORS.map((color) => {
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 24;
    const ctx = sprite.getContext("2d")!;
    const g = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    g.addColorStop(0, color);
    g.addColorStop(0.4, color + "88");
    g.addColorStop(1, color + "00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 24, 24);
    return sprite;
  });
}

function makeNebulaSprites(): HTMLCanvasElement[] {
  return NEBULA_COLORS.map((color) => {
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 256;
    const ctx = sprite.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return sprite;
  });
}

export function Starfield({
  camX,
  camY,
}: {
  camX: MotionValue<number>;
  camY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const starSprites = makeStarSprites();
    const nebulaSprites = makeNebulaSprites();
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const layers: Star[][] = LAYERS.map((layer) =>
      Array.from({ length: layer.count }, () => ({
        x: (Math.random() * 2 - 1) * SPREAD,
        y: (Math.random() * 2 - 1) * SPREAD,
        size: 0.5 + Math.random() * layer.sizeMax,
        alpha: 0.15 + Math.random() * layer.alphaMax,
        speed: 0.3 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        sprite: Math.random() < 0.05 ? 2 : Math.random() < 0.5 ? 0 : 1,
      })),
    );

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const camx = camX.get();
      const camy = camY.get();

      // Nebulae ride the far layer.
      for (const n of NEBULAE) {
        const d = n.r * 2;
        ctx.drawImage(
          nebulaSprites[n.color],
          cx + camx * 0.3 + n.x * 0.6 - n.r,
          cy + camy * 0.3 + n.y * 0.6 - n.r,
          d,
          d,
        );
      }

      layers.forEach((stars, i) => {
        const factor = LAYERS[i].factor;
        for (const s of stars) {
          const x = cx + camx * factor + s.x;
          const y = cy + camy * factor + s.y;
          if (x < -12 || x > width + 12 || y < -12 || y > height + 12) continue;
          const twinkle = reduced ? 0.8 : 0.65 + 0.35 * Math.sin(time * s.speed + s.phase);
          ctx.globalAlpha = s.alpha * twinkle;
          const d = s.size * 5;
          ctx.drawImage(starSprites[s.sprite], x - d / 2, y - d / 2, d, d);
        }
      });
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
      if (!running) return;
      draw(t / 1000);
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible" && !reduced;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) {
      // Single static frame; re-drawn on resize and camera jumps only.
      draw(0);
      const unsubX = camX.on("change", () => draw(0));
      const unsubY = camY.on("change", () => draw(0));
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => {
        unsubX();
        unsubY();
        window.removeEventListener("resize", onResize);
      };
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [camX, camY, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
