import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { HeroTokenizer } from "@/components/home/hero-tokenizer";
import { CourseMiniProgress } from "@/components/course/course-mini-progress";
import { COURSE_SLUGS } from "@/config/course";
import { COURSE_LESSON_META } from "@/config/library";
import { getPost } from "@/lib/posts";

/**
 * The library pillar: the free interactive course as the home's capture
 * argument (Clear's "free course IS the funnel" pattern), with the live
 * tokenizer as a touchable demo — moved here from the old hero.
 */
export function CoursePillar() {
  const lessons = COURSE_SLUGS.flatMap((slug) => {
    const post = getPost(slug);
    if (!post) return [];
    return [{ slug, title: post.title, meta: COURSE_LESSON_META[slug] }];
  });
  if (lessons.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-2">
      <Container
        size="wide"
        className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2"
      >
        <div className="max-w-xl">
          <Eyebrow>El pilar de la biblioteca · gratis</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
            Entiende la IA tocándola
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Seis lecciones interactivas en el orden que tiene sentido: no lees
            cómo funciona la IA, la manipulas. Sin cuentas ni registro — tu
            progreso se guarda en este navegador.
          </p>

          <ol className="mt-7 flex flex-col gap-2">
            {lessons.map((lesson, i) => (
              <li key={lesson.slug}>
                <Link
                  href={`/blog/${lesson.slug}`}
                  className="group flex items-center gap-3 text-sm"
                >
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface font-mono text-xs text-accent-ink"
                  >
                    {lesson.meta?.glyph ?? i + 1}
                  </span>
                  <span className="font-display text-fg transition-colors group-hover:text-accent-ink">
                    {lesson.title}
                  </span>
                  {lesson.meta ? (
                    <span className="hidden font-mono text-xs text-faint sm:inline">
                      {lesson.meta.format}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Button href="/empieza-aqui" size="lg">
              Empieza gratis →
            </Button>
            <CourseMiniProgress />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-wide text-faint">
            ▸ pruébalo aquí mismo — la lección 1, en vivo
          </p>
          <HeroTokenizer />
        </div>
      </Container>
    </section>
  );
}
