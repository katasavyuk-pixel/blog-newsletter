/**
 * Radar IA — anti-hallucination gate.
 *
 * Verifies that every <RadarItem> in a generated edition matches a real
 * candidate from scratch/radar-candidates.json: the URL must exist verbatim
 * and the title must be the candidate's exact title. If the writing model
 * invented or altered anything, this exits 1 and the workflow never opens a PR.
 *
 * Usage: node scripts/radar/verify-edition.mjs content/posts/radar-2026-07-20.mdx
 */
import { readFile } from "node:fs/promises";

const CANDIDATES_PATH = new URL("../../scratch/radar-candidates.json", import.meta.url);

const mdxPath = process.argv[2];
if (!mdxPath) {
  console.error("Usage: node scripts/radar/verify-edition.mjs <edition.mdx>");
  process.exit(1);
}

const mdx = await readFile(mdxPath, "utf8");
const { items } = JSON.parse(await readFile(CANDIDATES_PATH, "utf8"));
const byUrl = new Map(items.map((item) => [item.url, item]));

// Pull the attributes out of each <RadarItem ...> opening tag.
const radarItems = [...mdx.matchAll(/<RadarItem\s+([\s\S]*?)>/g)].map(([, attrs]) => {
  const get = (name) => attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1];
  return { title: get("title"), url: get("url"), source: get("source"), axis: get("axis") };
});

if (radarItems.length === 0) {
  console.error("No <RadarItem> found in the edition — nothing to verify, refusing to pass.");
  process.exit(1);
}

const errors = [];
for (const item of radarItems) {
  const candidate = byUrl.get(item.url);
  if (!candidate) {
    errors.push(`URL not in candidates (possible hallucination): ${item.url}`);
    continue;
  }
  if (item.title !== candidate.title) {
    errors.push(`Title altered for ${item.url}\n  expected: ${candidate.title}\n  got:      ${item.title}`);
  }
  if (item.source !== candidate.source) {
    errors.push(`Source altered for ${item.url}: expected "${candidate.source}", got "${item.source}"`);
  }
  if (item.axis !== candidate.axis) {
    errors.push(`Axis altered for ${item.url}: expected "${candidate.axis}", got "${item.axis}"`);
  }
}

if (errors.length > 0) {
  console.error(`VERIFICATION FAILED (${errors.length} problems):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`ok — ${radarItems.length} items verified against real candidates.`);
