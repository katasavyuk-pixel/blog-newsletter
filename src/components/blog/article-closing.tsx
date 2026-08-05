import { RelatedPosts } from "@/components/blog/related-posts";
import { CierreEstandar } from "@/components/blog/cierre-estandar";
import { AuthorBio } from "@/components/blog/author-bio";
import { getRelatedPosts, type Post } from "@/lib/posts";

/**
 * One closing unit, replacing the four stacked blocks an article used to end
 * with (inline capture → share → related → NBI pitch), three of which drew
 * their own surface with different classes. Four asks in a row is not a
 * conversion strategy, it is a wall.
 *
 * What changed (2026-08-05): the call to action used to be *chosen* by `formato`,
 * so a reader saw one of three different closings depending on which article they
 * landed on. That made the closing unmeasurable and unmemorable — nothing repeats,
 * so nothing gets learned. Now all three exits render every time and `formato`
 * only decides which one is emphasised (src/config/cierre.ts).
 *
 * Nothing was lost in the swap: the lesson variant's course link is exit 1, and
 * the sistema/caso variant's "tell me what does not fit" is exit 2. The email
 * field that used to appear here for radar/nota/herramienta moved into the
 * article body, where it now appears on every article rather than three of nine.
 */
export function ArticleClosing({ post }: { post: Post }) {
  return (
    <>
      <AuthorBio />
      <CierreEstandar formato={post.formato} />
      <RelatedPosts posts={getRelatedPosts(post)} />
    </>
  );
}
