import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPostsByTag, type Post } from "@/lib/posts";

export type RadarHeadline = {
  title: string;
  source: string;
  url: string;
  date: string;
  axis: string;
  /** First sentence of the item's Spanish analysis, for card summaries. */
  summary: string;
};

/**
 * Latest "Radar IA" edition plus its headlines, parsed from the edition's
 * source MDX (build-time only — pages using this must stay static/server).
 * The <RadarItem> attributes are collector-verified real data, so parsing
 * the source file is safe and avoids duplicating state in a database.
 */
export function getLatestRadarEdition(): {
  edition: Post;
  headlines: RadarHeadline[];
} | null {
  const [edition] = getPostsByTag("radar");
  if (!edition) return null;

  let raw: string;
  try {
    raw = readFileSync(join(process.cwd(), "content", `${edition.path}.mdx`), "utf8");
  } catch {
    return null;
  }

  const headlines = [...raw.matchAll(/<RadarItem\s+([\s\S]*?)>([\s\S]*?)<\/RadarItem>/g)].map(
    ([, attrs, body]) => {
      const get = (name: string) =>
        attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
      const text = body.replace(/\s+/g, " ").trim();
      const firstSentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
      return {
        title: get("title"),
        source: get("source"),
        url: get("url"),
        date: get("date"),
        axis: get("axis"),
        summary: firstSentence,
      };
    },
  );

  return { edition, headlines };
}
