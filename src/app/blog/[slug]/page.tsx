import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { MDXContent } from "@/components/mdx/mdx-content";
import { widgets } from "@/components/mdx/widgets";
import { YouTubeEmbed } from "@/components/mdx/widgets/youtube-embed";
import { Toc } from "@/components/blog/toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { CopyCode } from "@/components/blog/copy-code";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ArticleClosing } from "@/components/blog/article-closing";
import { PostMeta } from "@/components/content/post-meta";
import { TagPill } from "@/components/content/tag-pill";
import { CourseProgressMarker } from "@/components/course/course-progress-marker";
import { allPosts, getPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { FORMATOS, TEMAS } from "@/config/taxonomy";
import { COURSE_SLUGS } from "@/config/course";

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
  // Two headings is already worth a table of contents; the old threshold of >2
  // hid it on most articles, so the rail sat empty on pages that needed it.
  const showToc = post.toc.length > 1;

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

      {/* Header and body share one grid column so they sit on the same optical
          axis. They used to be separate containers — a centred max-w-3xl header
          over a max-w-5xl grid — so on desktop the h1 and the text it
          introduced were visibly out of alignment. */}
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
        <div className="min-w-0">
          <nav aria-label="Migas" className="font-mono text-xs text-faint">
            <Link href="/blog" className="text-accent-ink hover:underline">
              Artículos
            </Link>
            <span aria-hidden> / </span>
            <span>{TEMAS[post.tema]}</span>
          </nav>

          <header className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
              {FORMATOS[post.formato]}
            </p>
            <h1 className="headline mt-3 text-4xl text-fg text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">
              {post.dek ?? post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5">
              <span className="font-mono text-xs text-fg">
                {siteConfig.author.name}
              </span>
              <span aria-hidden className="text-faint">
                ·
              </span>
              <PostMeta post={post} />
              {post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                  {post.tags.map((tag) => (
                    <TagPill
                      key={tag}
                      tag={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </header>

          {post.youtubeId ? (
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          ) : null}

          <div className="mt-10">
            <Prose>
              <MDXContent code={post.content} components={widgets} />
            </Prose>
          </div>

          <CopyCode />
          <ArticleClosing post={post} />
          {(COURSE_SLUGS as readonly string[]).includes(post.slug) ? (
            <CourseProgressMarker slug={post.slug} />
          ) : null}
        </div>

        {/* Sticky rail: contents plus sharing, which used to sit at the bottom
            of the four-block pile where it competed with the calls to action. */}
        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            {showToc ? <Toc items={post.toc} /> : null}
            <ShareButtons url={fullUrl} title={post.title} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
