"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { dismissIntent, useIntentVisible } from "@/hooks/use-intent-wizard";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { Mascot } from "@/components/wizard/mascot";
import {
  EMAIL_STEP,
  FORMA_OPTIONS,
  INTENT_OPTIONS,
  MASCOT,
  RUMBO_COPY,
  type FormaOption,
  type IntentOption,
} from "@/config/intent";

/** 0 intro · 1 intención · 2 formato · 3 email · 4 rumbo */
const TOTAL = 5;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Chispa cambia de pose al avanzar el wizard (la mascota "se mueve por la pantalla"). */
const MASCOT_POSES = [
  { x: 0, y: 0, rotate: 0 },
  { x: 16, y: -8, rotate: -6 },
  { x: -14, y: 6, rotate: 7 },
  { x: 10, y: 4, rotate: -4 },
  { x: 0, y: -10, rotate: 2 },
];

/**
 * Vuelo de entrada (~4,6 s): Chispa entra orbitando, se detiene al centro de
 * la pantalla y "te mira", y después se lanza hacia ti (crece ×9 con blur
 * fuerte) hasta atravesar la cámara (opacidad 0). Los valores finales coinciden
 * con los iniciales del aterrizaje, así el corte nunca se ve.
 */
const FLIGHT = {
  x: ["-55vw", "30vw", "-25vw", "18vw", "18vw", "18vw"],
  y: ["-30vh", "18vh", "38vh", "22vh", "22vh", "22vh"],
  scale: [0.5, 0.75, 0.9, 1.1, 1.18, 9],
  opacity: [0, 1, 1, 1, 1, 0],
  rotate: [-14, 8, -6, 0, 0, 0],
  filter: [
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(0px)",
    "blur(30px)",
  ],
};
const FLIGHT_TIMES = [0, 0.17, 0.34, 0.5, 0.62, 1];
const FLIGHT_DURATION = 4.6;

/** Aterrizaje: desde el punto donde atravesó la cámara vuelve a su sitio del
 * panel, desenfocándose... al revés: de blur 30 a nítido. Mismo elemento, sin
 * desmontar — continuidad total. */
const LAND = { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" };

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
            animate={{ width: `${((step - 1) / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <span className="font-mono text-xs text-faint">
          {step}/{TOTAL - 1}
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
 * cinematic flight → panel materializes around her → intent → format → email
 * capture → rumbo. Chispa is a single element that never unmounts, so the
 * entrance and the wizard read as one continuous take. Client-only — renders
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
    : step === 3 ? MASCOT.lines.email
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
          {/* Resplandor ambiental: se enciende cuando Chispa se acerca y se
              queda suave en el wizard. Mismo elemento, transición continua. */}
          <motion.div
            aria-hidden
            className="glow-layer left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 bg-accent/25"
            animate={
              entering
                ? { opacity: [0.12, 0.16, 0.5], scale: [0.5, 0.7, 1.5] }
                : { opacity: 0.16, scale: 1 }
            }
            transition={
              entering
                ? { duration: FLIGHT_DURATION, times: [0, 0.62, 1], ease: "easeInOut" }
                : { duration: 1, ease: EASE }
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
                  x: "-55vw",
                  y: "-30vh",
                  scale: 0.5,
                  opacity: 0,
                  rotate: -14,
                  filter: "blur(0px)",
                }}
                animate={entering ? FLIGHT : LAND}
                transition={
                  entering
                    ? { duration: FLIGHT_DURATION, times: FLIGHT_TIMES, ease: "easeInOut" }
                    : { duration: 0.9, ease: EASE }
                }
                onAnimationComplete={() => {
                  if (entering) setPhase("wizard");
                }}
              >
                <motion.div
                  animate={MASCOT_POSES[step] ?? MASCOT_POSES[0]}
                  transition={{ type: "spring", stiffness: 160, damping: 14 }}
                >
                  <Mascot name={MASCOT.name} />
                </motion.div>
              </motion.div>

              {!entering ? (
                <motion.div
                  className="flex-1 border-l border-dark-border-2 pl-4"
                  initial={{ opacity: 0, x: -10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
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

            {/* El contenido del wizard se materializa suave alrededor de Chispa
                mientras ella aterriza — sin blur agresivo ni cortes. */}
            {!entering ? (
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
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

                  {step === 3 ? (
                    <Step
                      key="email"
                      step={4}
                      kicker={EMAIL_STEP.kicker}
                      title={EMAIL_STEP.title}
                      back
                      onBack={() => setStep(2)}
                    >
                      <p className="text-sm leading-relaxed text-muted">{EMAIL_STEP.hint}</p>
                      <div className="mt-4">
                        <SubscribeForm
                          source="wizard"
                          tone="dark"
                          layout="stacked"
                          submitLabel={EMAIL_STEP.submit}
                          doneMessage="¡Casi! Revisa tu correo y confirma (doble opt-in)."
                        />
                      </div>
                      <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setStep(4)}>
                          {EMAIL_STEP.skip} — quiero entrar ya
                        </Button>
                      </div>
                    </Step>
                  ) : null}

                  {step === 4 && selected ? (
                    <Step
                      key="rumbo"
                      step={5}
                      kicker="Tu rumbo"
                      title={RUMBO_COPY[selected.id]}
                      back
                      onBack={() => setStep(3)}
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
