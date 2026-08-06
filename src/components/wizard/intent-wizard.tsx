"use client";

import {
  AnimatePresence,
  cubicBezier,
  easeInOut,
  easeOut,
  motion,
} from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { dismissIntent, useIntentVisible } from "@/hooks/use-intent-wizard";
import { Mascot } from "@/components/wizard/mascot";
import {
  FORMA_OPTIONS,
  INTENT_OPTIONS,
  MASCOT,
  RUMBO_COPY,
  type FormaOption,
  type IntentOption,
} from "@/config/intent";

/** 0 intro · 1 intención · 2 formato · 3 rumbo */
const TOTAL = 4;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Chispa cambia de pose al avanzar el wizard (la mascota "se mueve por la pantalla"). */
const MASCOT_POSES = [
  { x: 0, y: 0, rotate: 0 },
  { x: 16, y: -8, rotate: -6 },
  { x: -14, y: 6, rotate: 7 },
  { x: 0, y: -10, rotate: 2 },
];

/**
 * Vuelo de entrada (~4,6 s) en cuatro tiempos: Chispa entra orbitando, converge
 * al hueco que ocupará en el panel, **se acerca nítida** hasta llenar el cuadro,
 * sostiene un beat mirándote y solo entonces se desenfoca al atravesar la cámara.
 *
 * El orden es el arreglo. Antes empezaba a difuminarse a la vez que se lanzaba
 * hacia ti, con `blur(30px)` sobre `scale: 9` — y dentro de ella el halo del
 * propio `Mascot` lleva su `filter: blur(80px)`. Un filtro en un ancestro se
 * aplica al subárbol **ya rasterizado**, y va en coordenadas locales *antes* del
 * transform, así que en pantalla eran ≈270 px de desenfoque encima de ≈720 px:
 * el borrón sucio que se veía. Ahora `--mascot-halo` llega a 0 antes de que el
 * wrapper difumine — nunca hay dos filtros vivos a la vez — y el blur cae a
 * 12 px porque a `scale 6.8` ya son ≈80 px de radio en pantalla.
 *
 * El pequeño desvío a la derecha del tramo final solo recentra el primer plano:
 * su hueco del panel está a la izquierda del cuadro.
 *
 * Las escalas están calibradas contra `size="hero"` (360 px nativos), así que el
 * primer plano llega a ×1,56 y no a ×4,4 — el mismo tamaño en pantalla (≈560 px)
 * partiendo de una caja que ya lo mide, en vez de estirar un mapa de bits
 * pequeño. No corrige un fallo visible (medido a 2× sale nítido de las dos
 * formas), quita la dependencia de que el navegador decida re-rasterizar.
 */
const FLIGHT = {
  x: ["-58vw", "24vw", "-20vw", "8vw", "0vw", "0vw", "3vw", "5vw", "6vw"],
  y: ["-32vh", "14vh", "30vh", "12vh", "0vh", "0vh", "0vh", "0vh", "0vh"],
  scale: [0.09, 0.16, 0.21, 0.26, 0.28, 0.31, 1.39, 1.57, 2.42],
  opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
  rotate: [-16, 9, -7, 3, 0, 0, 0, 0, 0],
  filter: [
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(12px)",
  ],
  // Se apaga durante la aproximación: es el halo que, anidado bajo el blur del
  // wrapper, producía el doble difuminado.
  "--mascot-halo": [1, 1, 1, 1, 1, 1, 0.2, 0.1, 0],
};

/** Los tres tramos que importan: 0.70→0.86 se acerca **nítida** (0,74 s),
 *  0.86→0.92 el beat más cerca (0,28 s), 0.92→1 desenfoca y pasa (0,37 s). */
const FLIGHT_TIMES = [0, 0.12, 0.26, 0.42, 0.56, 0.7, 0.86, 0.92, 1];

/** Una curva por tramo (`ease` admite un array de N-1). La aproximación va en
 *  ease-in para que acelere hacia ti; el pase, más agresivo todavía. Funciones y
 *  no tuplas para que el array tipe como `EasingFunction[]` sin ceremonia. */
const FLIGHT_EASE = [
  easeOut, // entra en cuadro
  easeInOut, // órbita
  easeInOut, // órbita
  easeOut, // converge a su hueco
  easeInOut, // respira
  cubicBezier(0.5, 0, 0.9, 0.35), // se lanza hacia ti
  easeOut, // el beat más cerca
  cubicBezier(0.4, 0, 1, 1), // atraviesa la cámara
];

const FLIGHT_DURATION = 4.6;

/**
 * Aterrizaje: vuelve al cuadro pequeña y **nítida**.
 *
 * Todas las propiedades van como keyframes a propósito. Motion salta al primer
 * valor de inmediato, y como en ese instante Chispa está a `opacity: 0`, el
 * estado `scale 6.8 / blur(12px)` se **descarta** en vez de destejerse. Antes se
 * animaba de vuelta desde ahí, así que el desenfoque se veía dos veces: una al
 * irse y otra al volver. Ahora hay uno solo en toda la secuencia. De regalo,
 * "Saltar intro" a mitad de vuelo aterriza igual de limpio.
 */
const LAND = {
  x: 0,
  y: 0,
  rotate: 0,
  filter: ["blur(0px)", "blur(0px)"],
  "--mascot-halo": [0, 1],
  scale: [0.42, 1],
  opacity: [0, 1],
};

type StepProps = {
  step: number;
  kicker: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  back?: boolean;
  onBack?: () => void;
  cta?: ReactNode;
};

/** Shared chrome of a wizard step: kicker, Anton title, progress bar, footer, CTA. */
function Step({ step, kicker, title, children, footer, back, onBack, cta }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-dark-border">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / (TOTAL - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        {/* The intro counts as a step, so this is 1/4 … 4/4. It used to read
            `{step}/{TOTAL - 1}`, which showed "5/4" on the last one. */}
        <span className="font-mono text-xs text-faint">
          {step}/{TOTAL}
        </span>
        {back ? (
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-xs text-faint transition-colors hover:text-fg"
          >
            ← Atrás
          </button>
        ) : null}
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{kicker}</p>
      <h2 className="headline mt-2 text-3xl text-fg sm:text-4xl">{title}</h2>

      <div className="mt-6">{children}</div>

      {footer ? <div className="mt-6">{footer}</div> : null}
      {cta ? <div className="mt-6">{cta}</div> : null}
    </motion.div>
  );
}

/**
 * One-time entry wizard, guided by the site's mascot (Chispa):
 * cinematic flight → panel materializes around her → intent → format → rumbo.
 * Chispa is a single element that never unmounts, so the entrance and the wizard
 * read as one continuous take. It routes, it does not capture: see the note in
 * `@/config/intent` for why there is no email step. Client-only — renders
 * nothing on the server and nothing under reduced motion (the calm scrollable
 * homepage is the fallback there).
 */
export function IntentWizard() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const visible = useIntentVisible();

  const [phase, setPhase] = useState<"entering" | "wizard">("entering");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<IntentOption | null>(null);
  const [forma, setForma] = useState<FormaOption | null>(null);

  const entering = phase === "entering";

  const dismiss = () => dismissIntent();

  const goToRoute = (route: string) => {
    dismiss();
    router.push(route);
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (reduced) return null;

  const line =
    step === 0 ? MASCOT.lines.intro
    : step === 1 ? MASCOT.lines.intencion
    : step === 2 ? MASCOT.lines.forma
    : MASCOT.lines.rumbo;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="wizard-root"
          role="dialog"
          aria-modal="true"
          aria-label="Entrar con Kata"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Resplandor ambiental. Se queda oscuro durante la órbita y florece
              con la aproximación, de modo que alcanza su pico justo cuando ella
              se desvanece: Chispa no desaparece, se disuelve en su propia luz.
              Después baja sola durante el aterrizaje — mismo elemento, sin
              corte. Es hermano del vuelo, nunca su padre: dos capas con blur
              pueden convivir, anidarlas es lo que ensuciaba la imagen. */}
          <motion.div
            aria-hidden
            className="glow-layer left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 bg-accent/25"
            animate={
              entering
                ? { opacity: [0.1, 0.13, 0.5], scale: [0.5, 0.65, 1.5] }
                : { opacity: 0.16, scale: 1 }
            }
            transition={
              entering
                ? { duration: FLIGHT_DURATION, times: [0, 0.7, 1], ease: "easeInOut" }
                : { duration: 1.1, ease: EASE }
            }
          />

          <div className="relative mx-4 w-full max-w-lg">
            {!entering ? (
              <button
                type="button"
                onClick={dismiss}
                className="absolute -top-10 right-0 font-mono text-xs text-faint transition-colors hover:text-fg"
              >
                Saltar ↩
              </button>
            ) : null}

            {/* Chispa: un solo elemento para todo el recorrido — vuelo,
                aterrizaje y poses por paso (el pose va en un wrapper interno). */}
            <div className="mb-7 flex items-center gap-4">
              <motion.div
                initial={{
                  x: "-58vw",
                  y: "-32vh",
                  scale: 0.09,
                  opacity: 0,
                  rotate: -16,
                  filter: "blur(0px)",
                  "--mascot-halo": 1,
                }}
                animate={entering ? FLIGHT : LAND}
                transition={
                  entering
                    ? {
                        duration: FLIGHT_DURATION,
                        times: FLIGHT_TIMES,
                        ease: FLIGHT_EASE,
                      }
                    : {
                        duration: 0.75,
                        ease: EASE,
                        scale: { type: "spring", stiffness: 180, damping: 16 },
                        opacity: { duration: 0.45, ease: EASE },
                      }
                }
                onAnimationComplete={() => {
                  if (entering) setPhase("wizard");
                }}
              >
                <motion.div
                  animate={MASCOT_POSES[step] ?? MASCOT_POSES[0]}
                  transition={{ type: "spring", stiffness: 160, damping: 14 }}
                >
                  {/* Nativa a 360 px durante el vuelo, para llegar al primer
                      plano encogiendo y no ampliando. El cambio de caja ocurre
                      en el salto de fase, con ella a opacidad 0. */}
                  <Mascot name={MASCOT.name} size={entering ? "hero" : "md"} />
                </motion.div>
              </motion.div>

              {!entering ? (
                <motion.div
                  className="flex-1 border-l border-dark-border-2 pl-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
                >
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="text-sm leading-relaxed text-muted"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-ink">
                      {MASCOT.name} ·
                    </span>{" "}
                    {line}
                  </motion.p>
                </motion.div>
              ) : null}
            </div>

            {/* El contenido del wizard se materializa alrededor de Chispa
                mientras ella aterriza. Sin `filter`: el panel y el bocadillo
                también entraban desenfocándose, con curvas distintas entre sí y
                distintas de la de ella, y el ojo se quedaba con tres focos que
                resolver a la vez. Un desplazamiento y un pelo de escala dan la
                misma sensación de materialización sin competir. */}
            {!entering ? (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
              >
                <AnimatePresence mode="wait">
                  {step === 0 ? (
                    <Step key="intro" step={1} kicker="Bienvenido" title="Dame 20 segundos y te pongo en ruta.">
                      <Button size="lg" onClick={() => setStep(1)}>
                        Empezar
                      </Button>
                      <p className="mt-4 font-mono text-xs text-faint">
                        Solo te pregunto un par de cosas. Se queda en tu navegador, no en mi base de datos.
                      </p>
                    </Step>
                  ) : null}

                  {step === 1 ? (
                    <Step
                      key="intent"
                      step={2}
                      kicker="Hola, soy Kata"
                      title="¿Qué te trae hoy?"
                      footer={
                        <p className="font-mono text-xs text-faint">
                          Solo te pregunto una vez. Queda en tu navegador, no en mi base de datos.
                        </p>
                      }
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {INTENT_OPTIONS.map((opt, i) => (
                          <motion.button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelected(opt)}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + i * 0.06, duration: 0.3, ease: EASE }}
                            whileHover={{ y: -3 }}
                            className={`flex flex-col rounded-2xl border bg-surface p-4 text-left transition-colors hover:bg-surface-2 ${
                              selected?.id === opt.id
                                ? "border-accent bg-accent/10"
                                : "border-border hover:border-accent/40"
                            }`}
                          >
                            <span className="font-punch text-lg text-fg">{opt.label}</span>
                            <span className="mt-1 text-sm leading-snug text-muted">{opt.hint}</span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button size="lg" disabled={!selected} onClick={() => setStep(2)}>
                          {selected ? "Seguir" : "Elige una opción"}
                        </Button>
                      </div>
                    </Step>
                  ) : null}

                  {step === 2 ? (
                    <Step
                      key="forma"
                      step={3}
                      kicker="Una pista más"
                      title="¿Cómo prefieres consumirlo?"
                      back
                      onBack={() => setStep(1)}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {FORMA_OPTIONS.map((f, i) => (
                          <motion.button
                            key={f.id}
                            type="button"
                            onClick={() => setForma(f)}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 + i * 0.05, duration: 0.3, ease: EASE }}
                            whileHover={{ y: -3 }}
                            className={`flex flex-col rounded-2xl border bg-surface p-4 text-left transition-colors hover:bg-surface-2 ${
                              forma?.id === f.id
                                ? "border-accent bg-accent/10"
                                : "border-border hover:border-accent/40"
                            }`}
                          >
                            <span className="font-punch text-lg text-fg">{f.label}</span>
                            <span className="mt-1 text-sm leading-snug text-muted">{f.hint}</span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button size="lg" disabled={!forma} onClick={() => setStep(3)}>
                          {forma ? "Seguir" : "Elige una opción"}
                        </Button>
                      </div>
                    </Step>
                  ) : null}

                  {step === 3 && selected ? (
                    <Step
                      key="rumbo"
                      step={4}
                      kicker="Tu rumbo"
                      title={RUMBO_COPY[selected.id]}
                      back
                      onBack={() => setStep(2)}
                    >
                      <div className="rounded-2xl border border-border bg-surface p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
                          Destino
                        </p>
                        <p className="mt-2 font-punch text-2xl text-fg">{selected.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{selected.hint}</p>
                        {forma ? (
                          <p className="mt-3 border-t border-border pt-3 font-mono text-xs text-faint">
                            Preferencia guardada: {forma.label.toLowerCase()} · {forma.hint.toLowerCase()}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button size="lg" onClick={() => goToRoute(selected.route)}>
                          Ir a {selected.label}
                        </Button>
                        <Button variant="ghost" size="lg" onClick={dismiss}>
                          Seguir en la portada
                        </Button>
                      </div>
                    </Step>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </div>

          {entering ? (
            <motion.button
              type="button"
              onClick={() => setPhase("wizard")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute right-6 top-6 font-mono text-xs text-faint transition-colors hover:text-fg"
            >
              Saltar intro →
            </motion.button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
