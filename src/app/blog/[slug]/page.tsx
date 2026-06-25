import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { MDXContent } from "@/components/mdx/mdx-content";
import { widgets } from "@/components/mdx/widgets";
import { Toc } from "@/components/blog/toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { CopyCode } from "@/components/blog/copy-code";
import { ShareButtons } from "@/components/blog/share-buttons";
import { allPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.permalink },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: post.permalink,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const fullUrl = `${siteConfig.url}${post.permalink}`;
  const showToc = post.toc.length > 2;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: siteConfig.author.name },
    publisher: { "@type": "Person", name: siteConfig.author.name },
    mainEntityOfPage: fullUrl,
    url: fullUrl,
  };

  return (
    <Container className="py-12">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-accent-ink hover:underline"
        >
          ← Volver al blog
        </Link>
        <header className="mt-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
            {post.kicker ?? post.tags[0] ?? "Artículo"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight text-fg text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">
            {post.dek ?? post.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5 text-sm text-muted">
            <span className="font-medium text-fg">{siteConfig.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.metadata.readingTime} min de lectura</span>
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-accent-ink hover:bg-surface-2"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </header>
      </div>

      <div className="mx-auto mt-10 max-w-3xl lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        <div>
          <Prose>
            <MDXContent code={post.content} components={widgets} />
          </Prose>
          <CopyCode />
          <ShareButtons url={fullUrl} title={post.title} />
        </div>
        {showToc ? (
          <aside className="mt-12 lg:mt-0">
            <Toc items={post.toc} />
          </aside>
        ) : null}
      </div>
    </Container>
  );
}
