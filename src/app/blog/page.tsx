import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/blog/post-card";
import { TagList } from "@/components/blog/tag-list";
import { allPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre inteligencia artificial: del fundamento a la práctica, sin humo.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const tags = getAllTags();

  return (
    <Container className="py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Artículos sobre cómo entender y aplicar la inteligencia artificial.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-8">
          <TagList tags={tags} />
        </div>
      ) : null}

      {allPosts.length === 0 ? (
        <p className="mt-12 text-muted">
          Aún no hay artículos. Añade un <code className="text-accent-ink">.mdx</code> en{" "}
          <code className="text-accent-ink">content/posts/</code>.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {allPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
