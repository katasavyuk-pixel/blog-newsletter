import Link from "next/link";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { RelatedPosts } from "@/components/blog/related-posts";
import { siteConfig } from "@/config/site";
import { getRelatedPosts, type Post } from "@/lib/posts";

/**
 * One closing unit, replacing the four stacked blocks an article used to end
 * with (inline capture → share → related → NBI pitch), three of which drew
 * their own surface with different classes. Four asks in a row is not a
 * conversion strategy, it is a wall.
 *
 * The call to action is chosen by `formato`, so a reader who just finished a
 * beginner lesson is invited to continue the course rather than to hire anyone,
 * and never sees all three at once.
 *
 * Each variant closes with a question that can be answered by replying. The
 * metric for this phase is qualified inbound conversations per 100 subscribers,
 * not signups — so the ask is a reply, not a form, wherever that is plausible.
 */
function ClosingCall({ post }: { post: Post }) {
  if (post.formato === "leccion") {
    return (
      <div className="not-prose mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-display text-lg font-semibold text-fg">
          Esta lección es parte del itinerario
        </p>
        <p className="mt-2 text-muted">
          Seis lecciones en orden, de los tokens a la vida completa de un
          prompt. Tu progreso se guarda solo.
        </p>
        <Link
          href="/empieza-aqui"
          className="mt-4 inline-block font-mono text-sm text-accent-ink hover:underline"
        >
          ▸ Ver el itinerario completo
        </Link>
      </div>
    );
  }

  if (post.formato === "sistema" || post.formato === "caso") {
    return (
      <div className="not-prose mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-display text-lg font-semibold text-fg">
          ¿Qué parte de esto no te encaja en tu negocio?
        </p>
        <p className="mt-2 text-muted">
          Responde a este artículo por email y te contesto. Si prefieres que lo
          implemente yo, hay una página para eso.
        </p>
        <Link
          href="/trabaja-con-nbi"
          className="mt-4 inline-block font-mono text-sm text-accent-ink hover:underline"
        >
          ▸ Trabaja con NBI
        </Link>
      </div>
    );
  }

  return (
    <div className="not-prose mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="font-display text-lg font-semibold text-fg">
        Cada sistema nuevo, cuando funciona
      </p>
      <p className="mt-2 text-muted">{siteConfig.newsletter.magnet}</p>
      <div className="mt-4">
        <SubscribeForm source="post-inline" />
      </div>
    </div>
  );
}

export function ArticleClosing({ post }: { post: Post }) {
  return (
    <>
      <ClosingCall post={post} />
      <RelatedPosts posts={getRelatedPosts(post)} />
    </>
  );
}
