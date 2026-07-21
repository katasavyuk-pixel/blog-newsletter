import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { CourseList, type CourseItem } from "@/components/course/course-list";
import { COURSE_SLUGS } from "@/config/course";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Empieza aquí — curso interactivo de IA",
  description:
    "El itinerario gratuito para entender la IA de verdad: seis lecciones interactivas en orden, de los tokens a la vida completa de un prompt. Tu progreso se guarda solo.",
  alternates: { canonical: "/empieza-aqui" },
};

export default function EmpiezaAquiPage() {
  // Course = the interactive posts in pedagogical order; skip any unpublished.
  const items: CourseItem[] = COURSE_SLUGS.flatMap((slug) => {
    const post = getPost(slug);
    if (!post) return [];
    return [
      {
        slug: post.slug,
        title: post.title,
        description: post.dek ?? post.description,
        readingTime: post.metadata.readingTime,
        permalink: post.permalink,
      },
    ];
  });

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <Eyebrow>Gratis · interactivo · a tu ritmo</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Empieza aquí: entiende la IA tocándola
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Seis lecciones interactivas en el orden que tiene sentido: primero qué
          es un token, al final la vida completa de un prompt. Cada lección se
          manipula, no solo se lee. Tu progreso se guarda en este navegador —
          sin cuentas, sin registro.
        </p>
      </header>

      <div className="mt-12 max-w-3xl">
        <CourseList items={items} />
      </div>

      <div className="mt-14 max-w-3xl rounded-2xl border border-border bg-surface p-7">
        <h2 className="font-display text-xl font-medium text-fg">
          ¿Terminaste el itinerario?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          La newsletter sigue donde acaba el curso: una idea práctica de IA
          cuando hay algo que merece la pena, sin ruido.
        </p>
        <div className="mt-5">
          <Button href="/#newsletter">Suscríbete gratis</Button>
        </div>
      </div>
    </Container>
  );
}
