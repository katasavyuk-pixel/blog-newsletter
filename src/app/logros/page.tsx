import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AchievementsGrid } from "@/components/logros/achievements-grid";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Logros — ${siteConfig.name}`,
  description: "Tu progreso y logros en el blog. Sigue tu racha de lectura, descubre insignias y completa desafíos interactivos.",
};

export default function LogrosPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-medium leading-tight text-fg">
          Logros
        </h1>
        <p className="mt-2 text-lg text-muted">
          Sigue tu progreso mientras lees, aprendes e interactúas.
        </p>
        <AchievementsGrid />
      </div>
    </Container>
  );
}
