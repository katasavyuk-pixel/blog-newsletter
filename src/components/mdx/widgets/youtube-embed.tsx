import { cn } from "@/lib/utils";

/**
 * Privacy-enhanced embed (youtube-nocookie.com) for a post's companion episode.
 *
 * `entregaAqui` when the article hands over its own resource (frontmatter
 * `recurso`). The caption used to point at /recursos unconditionally, which on
 * such an article sends the reader away to give the same address to the same
 * list a second time — the duplication this whole change exists to remove.
 */
export function YouTubeEmbed({
  id,
  title,
  className,
  entregaAqui = false,
}: {
  id: string;
  title: string;
  className?: string;
  entregaAqui?: boolean;
}) {
  return (
    <figure
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border border-border bg-bg shadow-card",
        className,
      )}
    >
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted">
        {entregaAqui ? (
          <>Vídeo del episodio — el código y el prompt están más abajo, en este mismo artículo.</>
        ) : (
          <>
            Vídeo del episodio — el código está más abajo, en{" "}
            <a href="/recursos" className="text-accent-ink hover:underline">
              /recursos
            </a>
            .
          </>
        )}
      </figcaption>
    </figure>
  );
}
