import { posts, type Post } from "#site/content";

export type { Post };

/**
 * Public posts: not draft, not premium (premium is gated to members in Fase 3),
 * sorted by date descending. This is the single source for every public surface
 * (listing, post page, sitemap, RSS) so gating is enforced server-side everywhere.
 */
export const allPosts: Post[] = [...posts]
  .filter((post) => !post.draft && !post.premium)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export function getPost(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((post) => post.tags.includes(tag));
}
