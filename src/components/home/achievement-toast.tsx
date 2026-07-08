"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ACHIEVEMENTS, type AchievementUnlock } from "@/lib/achievements";

export function AchievementToast({
  unlock,
  onDismiss,
}: {
  unlock: AchievementUnlock | null;
  onDismiss: () => void;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!unlock) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [unlock, onDismiss]);

  const def = unlock ? ACHIEVEMENTS.find((a) => a.id === unlock.id) : null;

  return (
    <AnimatePresence>
      {unlock && def ? (
        <motion.div
          role="status"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-bg px-5 py-3 shadow-xl"
        >
          <span className="text-2xl">{def.icon}</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-ink">
              ¡Nuevo logro!
            </p>
            <p className="text-sm font-medium text-fg">{def.title}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
