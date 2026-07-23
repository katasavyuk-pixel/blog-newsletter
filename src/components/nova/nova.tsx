"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { COURSE_SLUGS, COURSE_PROGRESS_KEY } from "@/config/course";
import { useLocalState } from "@/hooks/use-local-state";
import { cn } from "@/lib/utils";
import type { UniversePulse } from "@/lib/universe";
import {
  novaScript,
  novaWhatIsThis,
  type NovaWizardOption,
} from "./nova-script";

/**
 * NOVA — the persistent copilot (spec §NOVA). A docked ember on every page;
 * on the map, right after the entry cinematic, she runs the arrival wizard:
 * routing question → coordinates (email, form nº 1, `source: nova-wizard`) →
 * flight to your orbit. Docked, she offers navigation, a contextual "what is
 * this", course progress and the capture form. Discipline: auto-opens at most
 * once per session, only on the map, never while you read; "no molestar"
 * silences her for good; global reduced-motion freezes her pulse.
 */

type View = "closed" | "wizard" | "menu" | "what" | "progress" | "save";

const WIZARD_DONE_KEY = "nova-wizard-done";
const MUTED_KEY = "nova-muted";
const SESSION_OFFERED_KEY = "nova-offered";

/** Sequentially fading lines — NOVA "speaking" without per-char JS. */
function Lines({ lines, from = 0 }: { lines: string[]; from?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <p
          key={line}
          className="nova-line mt-2 text-sm leading-relaxed text-on-dark-muted"
          style={{ animationDelay: `${(from + i) * 0.45}s` }}
        >
          {line}
        </p>
      ))}
    </>
  );
}

export function Nova({ pulse }: { pulse: UniversePulse }) {
  const pathname = usePathname();
  const router = useRouter();
  const [view, setView] = useState<View>("closed");
  const [chosen, setChosen] = useState<NovaWizardOption | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [wizardDone, setWizardDone] = useLocalState(WIZARD_DONE_KEY, false);
  const [muted, setMuted] = useLocalState(MUTED_KEY, false);
  const [introSeen] = useLocalState("universe-intro-seen", false);
  const [progress] = useLocalState<Record<string, boolean>>(COURSE_PROGRESS_KEY, {});
  const [seenContent, setSeenContent] = useLocalState<{ post?: string; radar?: string }>(
    "nova-seen-content",
    {},
  );
  const [celebrated, setCelebrated] = useLocalState("nova-celebrated", 0);

  const litCount = COURSE_SLUGS.filter((slug) => progress[slug]).length;
  const nextSlug = COURSE_SLUGS.find((slug) => !progress[slug]);

  // Real novelties since the last visit — only for RETURNING visitors (the
  // baseline is stored silently on the first mount).
  const postNews = !!(
    pulse.latestPost && seenContent.post && pulse.latestPost.date > seenContent.post
  );
  const radarNews = !!(
    pulse.radarDate && seenContent.radar && pulse.radarDate > seenContent.radar
  );
  const starNews = litCount > celebrated;
  const hasNews = postNews || radarNews || starNews;

  useEffect(() => {
    if (seenContent.post || seenContent.radar) return;
    if (!pulse.latestPost && !pulse.radarDate) return;
    const t = setTimeout(() => {
      setSeenContent({
        post: pulse.latestPost?.date,
        radar: pulse.radarDate ?? undefined,
      });
    }, 0);
    return () => clearTimeout(t);
  }, [seenContent, setSeenContent, pulse]);

  /**
   * Close, marking novelties as seen ONLY when they were actually displayed
   * (the menu is where the news block lives — closing from elsewhere keeps
   * the dock pulsing until the visitor really sees them).
   */
  const close = useCallback(() => {
    setView("closed");
    setCelebrating(false);
    if ((postNews || radarNews) && view === "menu") {
      setSeenContent({
        post: pulse.latestPost?.date ?? seenContent.post,
        radar: pulse.radarDate ?? seenContent.radar,
      });
    }
  }, [postNews, radarNews, view, pulse, seenContent, setSeenContent]);

  // Arrival wizard: on the map, once the entry cinematic has finished, at most
  // once per session. The timeout keeps setState out of the effect body and
  // gives the map a breath before NOVA speaks.
  useEffect(() => {
    if (pathname !== "/" || !introSeen || wizardDone || muted) return;
    let offered = false;
    try {
      offered = sessionStorage.getItem(SESSION_OFFERED_KEY) === "1";
    } catch {
      // storage unavailable — treat as offered to stay quiet
      offered = true;
    }
    if (offered) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_OFFERED_KEY, "1");
      } catch {
        // ignore
      }
      setView("wizard");
    }, 1100);
    return () => clearTimeout(t);
  }, [pathname, introSeen, wizardDone, muted]);

  // Esc closes any open panel.
  useEffect(() => {
    if (view === "closed") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, close]);

  const finishWizard = (href: string | null) => {
    setWizardDone(true);
    setChosen(null);
    close();
    if (href) router.push(href);
  };

  const open = view !== "closed";

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar NOVA" : "NOVA — tu copiloto"}
        aria-expanded={open}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          if (starNews) {
            setCelebrating(true);
            setCelebrated(litCount);
            setView("progress");
            return;
          }
          setView(wizardDone ? "menu" : "wizard");
        }}
        className={cn(
          "fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-dark-border-2 bg-dark/85 backdrop-blur transition-transform hover:scale-110",
          (!wizardDone || hasNews) && !muted && "glow-pulse",
        )}
      >
        <span
          aria-hidden
          className="block h-4 w-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, var(--color-accent-ink) 0%, var(--color-accent) 45%, var(--color-accent-strong) 100%)",
            boxShadow: "0 0 14px var(--color-glow-coral)",
          }}
        />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="NOVA"
          className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-sm rounded-2xl border border-dark-border-2 bg-dark/95 p-5 text-on-dark shadow-card-hover backdrop-blur-md sm:inset-x-auto sm:right-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-on-dark-muted">
              <span
                aria-hidden
                className="glow-pulse inline-block h-2.5 w-2.5 rounded-full bg-accent"
                style={{ boxShadow: "0 0 8px var(--color-glow-coral)" }}
              />
              {novaScript.name} · {novaScript.role}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar NOVA"
              className="rounded-full border border-dark-border-2 px-2 py-0.5 font-mono text-xs text-on-dark-muted transition-colors hover:text-on-dark"
            >
              ✕
            </button>
          </div>

          {view === "wizard" && !chosen ? (
            <div>
              <Lines lines={[...novaScript.wizard.greeting]} />
              <p className="nova-line mt-3 font-display text-sm font-bold" style={{ animationDelay: "0.9s" }}>
                {novaScript.wizard.ask}
              </p>
              <div className="nova-line mt-3 flex flex-col gap-2" style={{ animationDelay: "1.15s" }}>
                {novaScript.wizard.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setChosen(option)}
                    className="rounded-xl border border-dark-border-2 px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:text-on-dark"
                  >
                    <span aria-hidden className="font-mono text-salmon">
                      ▸{" "}
                    </span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {view === "wizard" && chosen ? (
            <div>
              <Lines lines={[chosen.reply, novaScript.wizard.emailAsk]} />
              <div className="nova-line mt-3" style={{ animationDelay: "0.9s" }}>
                <SubscribeForm source="nova-wizard" tone="dark" layout="stacked" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setChosen(null)}
                  className="font-mono text-xs text-on-dark-faint transition-colors hover:text-on-dark"
                >
                  {novaScript.menu.back}
                </button>
                <button
                  type="button"
                  onClick={() => finishWizard(chosen.href)}
                  className="rounded-xl bg-accent px-4 py-2 font-display text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
                >
                  {chosen.href ? novaScript.wizard.go : novaScript.wizard.stay}
                </button>
              </div>
            </div>
          ) : null}

          {view === "menu" ? (
            <div>
              {postNews || radarNews ? (
                <div className="mt-3 rounded-xl border border-dark-border-2 bg-dark-input/60 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-salmon">
                    {novaScript.news.title}
                  </p>
                  {postNews && pulse.latestPost ? (
                    <Link
                      href={pulse.latestPost.permalink}
                      onClick={close}
                      className="mt-1.5 block text-sm text-on-dark transition-colors hover:text-salmon"
                    >
                      <span aria-hidden className="font-mono text-salmon">
                        ▸{" "}
                      </span>
                      {novaScript.news.post} {pulse.latestPost.title}
                    </Link>
                  ) : null}
                  {radarNews ? (
                    <Link
                      href="/blog/tag/radar"
                      onClick={close}
                      className="mt-1.5 block text-sm text-on-dark transition-colors hover:text-salmon"
                    >
                      <span aria-hidden className="font-mono text-salmon">
                        ▸{" "}
                      </span>
                      {novaScript.news.radar}
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <p className="mt-3 font-display text-sm font-bold">{novaScript.menu.title}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-on-dark-faint">
                {novaScript.menu.navTitle}
              </p>
              <nav className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {novaScript.menu.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="text-sm text-on-dark-muted transition-colors hover:text-on-dark"
                  >
                    <span aria-hidden className="font-mono text-salmon">
                      ▸{" "}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-1.5 border-t border-dark-border pt-3">
                <button type="button" onClick={() => setView("what")} className="text-left text-sm text-on-dark-muted transition-colors hover:text-on-dark">
                  {novaScript.menu.whatIsThis}
                </button>
                <button type="button" onClick={() => setView("progress")} className="text-left text-sm text-on-dark-muted transition-colors hover:text-on-dark">
                  {novaScript.menu.progress}
                </button>
                <button type="button" onClick={() => setView("save")} className="text-left text-sm text-on-dark-muted transition-colors hover:text-on-dark">
                  {novaScript.menu.save}
                </button>
                <button
                  type="button"
                  onClick={() => setMuted(!muted)}
                  className="text-left font-mono text-xs text-on-dark-faint transition-colors hover:text-on-dark"
                >
                  {muted ? novaScript.menu.muteOff : novaScript.menu.muteOn}
                </button>
              </div>
            </div>
          ) : null}

          {view === "what" ? (
            <div>
              <Lines lines={[novaWhatIsThis(pathname)]} />
              <button
                type="button"
                onClick={() => setView("menu")}
                className="mt-4 font-mono text-xs text-on-dark-faint transition-colors hover:text-on-dark"
              >
                {novaScript.menu.back}
              </button>
            </div>
          ) : null}

          {view === "progress" ? (
            <div>
              {celebrating ? (
                <p className="nova-line mt-3 text-sm font-semibold text-salmon">
                  {novaScript.progress.celebrate}
                </p>
              ) : null}
              <p className="mt-3 font-display text-sm font-bold">{novaScript.progress.title}</p>
              <p aria-hidden className="mt-2 font-mono text-lg tracking-[0.35em] text-salmon">
                {COURSE_SLUGS.map((slug) => (progress[slug] ? "★" : "☆")).join("")}
              </p>
              <Lines
                lines={[
                  litCount === 0
                    ? novaScript.progress.none
                    : litCount === COURSE_SLUGS.length
                      ? novaScript.progress.all
                      : novaScript.progress.some(litCount, COURSE_SLUGS.length),
                ]}
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setView("menu")}
                  className="font-mono text-xs text-on-dark-faint transition-colors hover:text-on-dark"
                >
                  {novaScript.menu.back}
                </button>
                <Link
                  href={nextSlug ? `/blog/${nextSlug}` : "/empieza-aqui"}
                  onClick={close}
                  className="rounded-xl bg-accent px-4 py-2 font-display text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
                >
                  {litCount === 0 ? novaScript.progress.startCta : novaScript.progress.continueCta}
                </Link>
              </div>
            </div>
          ) : null}

          {view === "save" ? (
            <div>
              <Lines lines={[novaScript.wizard.emailAsk]} />
              <div className="nova-line mt-3" style={{ animationDelay: "0.45s" }}>
                <SubscribeForm source="nova-dock" tone="dark" layout="stacked" />
              </div>
              <button
                type="button"
                onClick={() => setView("menu")}
                className="mt-4 font-mono text-xs text-on-dark-faint transition-colors hover:text-on-dark"
              >
                {novaScript.menu.back}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
