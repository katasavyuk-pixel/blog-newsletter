import { TagPill } from "@/components/content/tag-pill";

/** Secondary keyword filter. Primary navigation is tema/formato, not tags. */
export function TagList({
  tags,
  active,
}: {
  tags: { tag: string; count: number }[];
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <TagPill
          key={tag}
          tag={tag}
          count={count}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          active={active === tag}
        />
      ))}
    </div>
  );
}
