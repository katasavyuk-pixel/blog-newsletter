import { Feed } from "feed";
import { allPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const base = siteConfig.url;
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: base,
    link: base,
    language: siteConfig.locale,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}`,
    feedLinks: { rss2: `${base}/feed.xml` },
    author: { name: siteConfig.author.name, link: base },
  });

  for (const post of allPosts) {
    const url = `${base}${post.permalink}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content: post.excerpt,
      date: new Date(post.date),
      author: [{ name: siteConfig.author.name }],
      category: post.tags.map((name) => ({ name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
