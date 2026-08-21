import type { MetadataRoute } from "next";
import { allPosts, getAllTags, getPostsByTag, type Post } from "@/lib/posts";
import { glossary } from "@/lib/glossary";
import { sentIssues } from "@/lib/newsletter-archive";
import { siteConfig } from "@/config/site";

/**
 * Newest real modification date among a set of posts, or the build date if the
 * set is empty.
 *
 * `lastModified: new Date()` on a static route — which is what nine of these
 * used to be — tells a crawler "this changed just now" on every single build.
 * It is not a rounding error, it is the sitemap asserting a change that did not
 * happen, and it trains crawlers to ignore the field. A listing page's real
 * modification date is the newest date among the things it lists.
 */
function newestOf(posts: Post[]): Date {
  const times = posts.map((p) => new Date(p.updated ?? p.date).getTime());
  return times.length > 0 ? new Date(Math.max(...times)) : new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const allNewest = newestOf(allPosts);
  const radarNewest = newestOf(getPostsByTag("radar"));
  // A listing page's lastModified is the newest thing it lists — the sent
  // editions for /newsletter, falling back to the build date while the
  // archive is empty.
  const newsletterNewest =
    sentIssues.length > 0 ? new Date(sentIssues[0].date) : new Date();

  // Routes whose content is hand-written rather than derived from posts. These
  // change when someone edits them, which a build cannot know, so the build date
  // is the most honest available answer — unlike the listing pages above it.
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: allNewest, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sistemas`, lastModified: allNewest, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: allNewest, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/radar`, lastModified: radarNewest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/empieza-aqui`, lastModified: allNewest, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/newsletter`, lastModified: newsletterNewest, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/glosario`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/recursos`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sobre-mi`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/trabaja-con-nbi`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacidad`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Sent editions only — an approved-but-unsent issue has no public URL yet,
  // so listing it here would advertise a page the gate in newsletter-archive
  // refuses to render.
  const newsletterRoutes: MetadataRoute.Sitemap = sentIssues.map((issue) => ({
    url: `${base}${issue.permalink}`,
    lastModified: new Date(issue.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const glossaryRoutes: MetadataRoute.Sitemap = Object.keys(glossary).map((id) => ({
    url: `${base}/glosario/${id}`,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${base}${post.permalink}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // `radar` is excluded: /blog/tag/radar now 308s to /radar, and a sitemap that
  // lists redirects instead of canonical URLs is asking crawlers to waste budget.
  const tagRoutes: MetadataRoute.Sitemap = getAllTags()
    .filter(({ tag }) => tag !== "radar")
    .map(({ tag }) => ({
      url: `${base}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: newestOf(getPostsByTag(tag)),
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [
    ...staticRoutes,
    ...glossaryRoutes,
    ...postRoutes,
    ...newsletterRoutes,
    ...tagRoutes,
  ];
}
