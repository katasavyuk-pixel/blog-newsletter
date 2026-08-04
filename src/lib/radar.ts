import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatDateShort } from "@/lib/format";
import { getPostsByTag, type Post } from "@/lib/posts";

/**
 * A weekly edition is late once it is more than ten days old — a Monday plus
 * enough slack that a merged-on-Tuesday edition does not read as broken.
 */
const CADENCE_GRACE_DAYS = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Whether the site may still claim a weekly cadence.
 *
 * "Cada lunes · en automático" used to be hardcoded next to the strip. It was
 * false for two weeks straight while the CI gate silently rejected editions,
 * and the homepage kept advertising it — the single most damaging thing on a
 * site whose whole argument is that its claims are checkable. Now the claim is
 * derived from the newest edition, so a broken pipeline degrades the copy
 * instead of turning it into a lie.
 */
export function getRadarCadence(
  editionDate: string,
  now = new Date(),
): { onSchedule: boolean; label: string } {
  const ageDays = (now.getTime() - new Date(editionDate).getTime()) / MS_PER_DAY;
  return ageDays <= CADENCE_GRACE_DAYS
    ? { onSchedule: true, label: "Cada lunes · en automático" }
    : { onSchedule: false, label: `Última edición: ${formatDateShort(editionDate)}` };
}

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
