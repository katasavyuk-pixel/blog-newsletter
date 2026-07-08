import { cn } from "@/lib/utils";
import type { AchievementDef, AchievementUnlock } from "@/lib/achievements";

export function AchievementCard({
  def,
  unlock,
  progress,
}: {
  def: AchievementDef;
  unlock?: AchievementUnlock;
  progress?: { current: number; total: number };
}) {
  const isUnlocked = !!unlock;
  const categoryColors: Record<string, string> = {
    streak: "border-accent/30 bg-accent/5",
    reading: "border-sky-500/30 bg-sky-500/5",
    interactive: "border-amber-500/30 bg-amber-500/5",
    social: "border-emerald-500/30 bg-emerald-500/5",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-5 transition-colors",
        isUnlocked
          ? categoryColors[def.category] ?? "border-accent/30 bg-accent/5"
          : "border-border bg-bg opacity-50",
      )}
    >
      <span className="text-3xl">{def.icon}</span>
      <div>
        <h3 className={cn("font-semibold", isUnlocked ? "text-fg" : "text-muted")}>
          {def.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{def.description}</p>
      </div>
      {isUnlocked && unlock ? (
        <p className="mt-auto text-xs text-muted">
          Desbloqueado el{" "}
          {new Date(unlock.unlockedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : null}
      {!isUnlocked && progress ? (
        <div className="mt-auto">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            {progress.current}/{progress.total}
          </p>
        </div>
      ) : null}
    </div>
  );
}
