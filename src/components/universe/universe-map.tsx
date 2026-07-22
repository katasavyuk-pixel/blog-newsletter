"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react";
import { WORLD_RADIUS, type Astro, type AstroKind, type UniverseData } from "@/config/universe";
import { AstroNode } from "./astro-node";
import { AstroPanel } from "./astro-panel";
import { Starfield } from "./starfield";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { cn } from "@/lib/utils";

/**
 * The navigable star map — the home IS this. A camera (x/y/scale motion
 * values, zero re-renders while flying) over a world div whose children are
 * the astros in world coordinates. Desktop: drag pans, wheel zooms (the map
 * is the home experience, not an embed — wheel belongs to it; "Vista lista"
 * jumps to the semantic layer). Touch: guided flight by default so page
 * scroll keeps working (`touch-action: pan-y`); "modo libre" opts into full
 * pan/pinch. Reduced motion: instant jumps, static starfield, CSS anims off.
 */

const MIN_SCALE = 0.26;
const MAX_SCALE = 2.4;
const CLICK_SLOP = 8;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Guided-flight visiting order by kind (comets are scenery, not stops). */
const GUIDED_PRIORITY: Partial<Record<AstroKind, number>> = {
  nucleo: 0,
  constelacion: 1,
  sistema: 2,
  pulsar: 3,
  protoestrella: 4,
  sonda: 5,
  baliza: 6,
};

export function UniverseMap({
  data,
  subscriberCount,
}: {
  data: UniverseData;
  subscriberCount: number | null;
}) {
  const { astros, week, mission } = data;
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const camX = useMotionValue(0);
  const camY = useMotionValue(0);
  const scale = useMotionValue(0.5);

  const [selected, setSelected] = useState<Astro | null>(null);
  const isCoarse = useCoarsePointer();
  const [touchMode, setTouchMode] = useState<"guided" | "free">("guided");
  const [guidedIndex, setGuidedIndex] = useState(-1);
  const [interacted, setInteracted] = useState(false);

  const controlsRef = useRef<AnimationPlaybackControls[]>([]);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, lastX: 0, lastY: 0, lastT: 0, vx: 0, vy: 0, pinch: 0, captured: false });

  const stopAnims = useCallback(() => {
    for (const c of controlsRef.current) c.stop();
    controlsRef.current = [];
  }, []);

  const clampCam = useCallback(
    (v: number) => {
      const m = WORLD_RADIUS * scale.get() + 120;
      return Math.min(m, Math.max(-m, v));
    },
    [scale],
  );

  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      const s = scale.get();
      const s2 = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s * factor));
      const k = s2 / s;
      camX.set(cx - (cx - camX.get()) * k);
      camY.set(cy - (cy - camY.get()) * k);
      scale.set(s2);
    },
    [camX, camY, scale],
  );

  const flyTo = useCallback(
    (astro: Astro, targetScale = 1.05) => {
      stopAnims();
      const s2 = Math.min(MAX_SCALE, Math.max(0.6, targetScale));
      const tx = -astro.x * s2;
      const ty = -astro.y * s2;
      if (reduced) {
        camX.set(tx);
        camY.set(ty);
        scale.set(s2);
        return;
      }
      controlsRef.current = [
        animate(camX, tx, { duration: 0.9, ease: EASE }),
        animate(camY, ty, { duration: 0.9, ease: EASE }),
        animate(scale, s2, { duration: 0.9, ease: EASE }),
      ];
    },
    [camX, camY, scale, reduced, stopAnims],
  );

  const select = useCallback(
    (astro: Astro) => {
      setSelected(astro);
      flyTo(astro);
    },
    [flyTo],
  );

  const selectById = useCallback(
    (id: string) => {
      const astro = astros.find((a) => a.id === id);
      if (astro) select(astro);
    },
    [astros, select],
  );

  const guidedStops = useMemo(
    () =>
      astros
        .filter((a) => GUIDED_PRIORITY[a.kind] !== undefined)
        .sort((a, b) => GUIDED_PRIORITY[a.kind]! - GUIDED_PRIORITY[b.kind]!),
    [astros],
  );

  const guidedGo = useCallback(
    (index: number) => {
      const n = guidedStops.length;
      const next = ((index % n) + n) % n;
      setGuidedIndex(next);
      select(guidedStops[next]);
    },
    [guidedStops, select],
  );

  // Wheel zoom needs a non-passive listener (React's onWheel can't preventDefault).
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoomAt(
        event.clientX - rect.left - rect.width / 2,
        event.clientY - rect.top - rect.height / 2,
        Math.exp(-event.deltaY * 0.0016),
      );
      setInteracted(true);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const panEnabled = useCallback(
    (event: React.PointerEvent) =>
      event.pointerType !== "touch" || !isCoarse || touchMode === "free",
    [isCoarse, touchMode],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    if (!panEnabled(event)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const g = gesture.current;
    if (pointers.current.size === 1) {
      stopAnims();
      g.moved = 0;
      g.captured = false;
      g.lastX = event.clientX;
      g.lastY = event.clientY;
      g.lastT = event.timeStamp;
      g.vx = 0;
      g.vy = 0;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
    setInteracted(true);
  };

  /**
   * Capture only once a real drag starts — capturing on pointerdown would
   * retarget pointerup to the viewport and swallow the astros' click events.
   */
  const captureIfDragging = () => {
    const g = gesture.current;
    if (!g.captured && g.moved > CLICK_SLOP) {
      for (const id of pointers.current.keys()) {
        viewportRef.current?.setPointerCapture(id);
      }
      g.captured = true;
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const g = gesture.current;

    if (pointers.current.size === 1) {
      const dx = event.clientX - g.lastX;
      const dy = event.clientY - g.lastY;
      const dt = Math.max(event.timeStamp - g.lastT, 1);
      camX.set(clampCam(camX.get() + dx));
      camY.set(clampCam(camY.get() + dy));
      g.vx = 0.8 * g.vx + 0.2 * ((dx / dt) * 16);
      g.vy = 0.8 * g.vy + 0.2 * ((dy / dt) * 16);
      g.moved += Math.abs(dx) + Math.abs(dy);
      g.lastX = event.clientX;
      g.lastY = event.clientY;
      g.lastT = event.timeStamp;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.pinch > 0) {
        const rect = viewportRef.current!.getBoundingClientRect();
        zoomAt(
          (a.x + b.x) / 2 - rect.left - rect.width / 2,
          (a.y + b.y) / 2 - rect.top - rect.height / 2,
          dist / g.pinch,
        );
      }
      g.pinch = dist;
      g.moved += CLICK_SLOP + 1;
    }
    captureIfDragging();
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (!pointers.current.delete(event.pointerId)) return;
    const g = gesture.current;
    if (pointers.current.size === 0 && g.moved > CLICK_SLOP && !reduced) {
      const speed = Math.abs(g.vx) + Math.abs(g.vy);
      if (speed > 1) {
        controlsRef.current = [
          animate(camX, clampCam(camX.get() + g.vx * 14), { duration: 0.8, ease: EASE }),
          animate(camY, clampCam(camY.get() + g.vy * 14), { duration: 0.8, ease: EASE }),
        ];
      }
    }
    if (pointers.current.size === 0) g.captured = false;
    g.pinch = 0;
  };

  const onBackgroundClick = (event: React.MouseEvent) => {
    if (gesture.current.moved > CLICK_SLOP) return;
    if ((event.target as HTMLElement).closest("button, a, form, input, label")) return;
    setSelected(null);
  };

  const rings = Math.min(week, 16);
  const ringGap = 950 / rings;
  const systems = astros.filter((a) => a.kind === "sistema" || a.kind === "pulsar" || a.kind === "constelacion").length;
  const forming = astros.filter((a) => a.kind === "protoestrella").length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-space">
      <div
        ref={viewportRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: !isCoarse || touchMode === "free" ? "none" : "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onBackgroundClick}
      >
        <Starfield camX={camX} camY={camY} />

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: camX, y: camY, scale }}
        >
          {/* Expansion rings — one per week of building in public. */}
          <svg
            aria-hidden
            className="pointer-events-none absolute overflow-visible"
            width="0"
            height="0"
          >
            {Array.from({ length: rings }, (_, i) => (
              <circle
                key={i}
                cx="0"
                cy="0"
                r={(i + 1) * ringGap}
                fill="none"
                stroke="var(--color-ring-line)"
                strokeWidth={i === rings - 1 ? 1.5 : 1}
              />
            ))}
            <text
              x={rings * ringGap * 0.7071}
              y={-(rings * ringGap) * 0.7071}
              fill="var(--color-faint)"
              fontSize="12"
              fontFamily="var(--font-mono)"
            >
              {`semana ${week}`}
            </text>
          </svg>

          {astros.map((astro) => (
            <AstroNode
              key={astro.id}
              astro={astro}
              selected={selected?.id === astro.id}
              onSelect={select}
              onFocusAstro={flyTo}
            />
          ))}
        </motion.div>
      </div>

      {/* HUD — top status line (SSR, part of the initial HTML). */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col gap-1 font-mono text-[11px] tracking-wide text-muted">
        <p>
          <span aria-hidden className="text-salmon">
            ▸{" "}
          </span>
          SEM {week} · {mission.toUpperCase()}
        </p>
        <p>
          {systems} SISTEMAS ENCENDIDOS · {forming} EN FORMACIÓN
        </p>
        {subscriberCount != null ? <p>{subscriberCount} A BORDO</p> : null}
      </div>

      <a
        href="#vista-lista"
        className="absolute right-4 top-4 z-20 rounded-full border border-dark-border-2 bg-dark/70 px-3 py-1.5 font-mono text-[11px] text-on-dark-muted backdrop-blur transition-colors hover:text-on-dark"
      >
        vista lista ↓
      </a>

      {/* Zoom controls (also the no-wheel fallback). */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col overflow-hidden rounded-xl border border-dark-border-2 bg-dark/70 backdrop-blur">
        <button
          type="button"
          aria-label="Acercar"
          onClick={() => zoomAt(0, 0, 1.35)}
          className="px-3 py-2 font-mono text-sm text-on-dark-muted transition-colors hover:text-on-dark"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Alejar"
          onClick={() => zoomAt(0, 0, 0.74)}
          className="border-t border-dark-border-2 px-3 py-2 font-mono text-sm text-on-dark-muted transition-colors hover:text-on-dark"
        >
          −
        </button>
      </div>

      <p
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-20 left-1/2 z-20 -translate-x-1/2 font-mono text-xs text-muted transition-opacity duration-700",
          interacted && "opacity-0",
        )}
      >
        {isCoarse ? "sigue la ruta · toca un astro" : "arrastra para explorar · rueda para zoom"}
      </p>

      {/* Guided flight — the mobile autopilot (hidden while a panel is open). */}
      {isCoarse && !selected ? (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-dark-border-2 bg-dark/80 px-2 py-1.5 font-mono text-xs text-on-dark backdrop-blur">
          <button
            type="button"
            aria-label="Parada anterior"
            onClick={() => guidedGo(guidedIndex - 1)}
            className="px-2 py-1 text-on-dark-muted transition-colors hover:text-on-dark"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => guidedGo(guidedIndex + 1)}
            className="min-w-28 px-1 text-center"
          >
            {guidedIndex === -1
              ? "▸ iniciar ruta"
              : `${guidedIndex + 1}/${guidedStops.length} ${guidedStops[guidedIndex].name}`}
          </button>
          <button
            type="button"
            aria-label="Parada siguiente"
            onClick={() => guidedGo(guidedIndex + 1)}
            className="px-2 py-1 text-on-dark-muted transition-colors hover:text-on-dark"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => setTouchMode(touchMode === "free" ? "guided" : "free")}
            className="border-l border-dark-border-2 pl-2 pr-1 text-on-dark-muted transition-colors hover:text-on-dark"
          >
            {touchMode === "free" ? "◉ ruta" : "✥ libre"}
          </button>
        </div>
      ) : null}

      <AstroPanel astro={selected} onClose={() => setSelected(null)} onSelectAstro={selectById} />
    </div>
  );
}
