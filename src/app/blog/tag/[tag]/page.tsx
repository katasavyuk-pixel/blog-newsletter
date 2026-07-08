import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/blog/post-card";
import { TagList } from "@/components/blog/tag-list";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Artículos etiquetados como ${decoded}.`,
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);
  if (posts.length === 0) notFound();

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-accent-ink">Etiqueta</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight text-fg">
          #{decoded}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {posts.length} {posts.length === 1 ? "artículo" : "artículos"}.
        </p>
      </header>

      <div className="mt-8">
        <TagList tags={getAllTags()} active={decoded} />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
