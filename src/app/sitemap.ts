import type { MetadataRoute } from "next";
import { allPosts, getAllTags } from "@/lib/posts";
import { glossary } from "@/lib/glossary";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sistemas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/empieza-aqui`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/glosario`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/recursos`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sobre-mi`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/trabaja-con-nbi`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const glossaryRoutes: MetadataRoute.Sitemap = Object.keys(glossary).map((id) => ({
    url: `${base}/glosario/${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${base}${post.permalink}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${base}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...glossaryRoutes, ...postRoutes, ...tagRoutes];
}
