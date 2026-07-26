import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { allPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * "Construir de cero" strip — published posts with a companion YouTube video.
 * Self-activating: renders nothing until the first video post ships, so it
 * can sit in the home layout before the channel launches.
 */
export function YouTubeStrip() {
  const episodes = allPosts.filter((post) => post.youtubeId).slice(0, 3);
  if (episodes.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-2">
      <Container size="wide" className="py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>YouTube · construcción pública</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium text-fg sm:text-4xl">
              Sistemas construidos en vídeo, explicados aquí
            </h2>
          </div>
          <Link
            href="/blog/tag/construccion-publica"
            className="font-display text-sm text-accent-ink transition-colors hover:text-accent-strong"
          >
            Todos los episodios →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {episodes.map((post) => (
            <Link
              key={post.slug}
              href={post.permalink}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
            >
              <div
                className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-dark"
                aria-hidden
              >
                <Image
                  src={`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent text-on-accent">
                  ▶
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-faint">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>·</span>
                <span>vídeo + artículo</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-medium leading-snug text-fg transition-colors group-hover:text-accent-ink">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
