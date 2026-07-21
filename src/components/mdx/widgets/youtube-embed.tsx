import { cn } from "@/lib/utils";

/** Privacy-enhanced embed (youtube-nocookie.com) for a post's companion episode. */
export function YouTubeEmbed({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
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
        Vídeo del episodio — el código está más abajo, en{" "}
        <a href="/recursos" className="text-accent-ink hover:underline">
          /recursos
        </a>
        .
      </figcaption>
    </figure>
  );
}
