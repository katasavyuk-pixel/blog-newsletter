/**
 * Radar IA — new-YouTube-video detector.
 *
 * Reads the channel's public RSS feed and compares each video ID against the
 * `youtubeId:` values already present in content/posts/**. Videos without a
 * post are written to scratch/youtube-new.json for the writing step.
 *
 * Idempotent and stateless: once a post with that youtubeId is merged, the
 * video stops being "new". No external state to keep in sync.
 *
 * Usage: YOUTUBE_CHANNEL_ID=UC... node scripts/radar/youtube.mjs
 */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";

const POSTS_DIR = new URL("../../content/posts/", import.meta.url);
const OUT_PATH = new URL("../../scratch/youtube-new.json", import.meta.url);

const channelId = process.env.YOUTUBE_CHANNEL_ID;
if (!channelId) {
  console.error("YOUTUBE_CHANNEL_ID is not set — nothing to do.");
  process.exit(1);
}

// Video IDs already referenced by a post (any frontmatter `youtubeId: <id>`).
const knownIds = new Set();
for (const file of await readdir(POSTS_DIR, { recursive: true })) {
  if (!file.endsWith(".mdx")) continue;
  const text = await readFile(new URL(file, POSTS_DIR), "utf8");
  const match = text.match(/^youtubeId:\s*["']?([\w-]{6,})["']?\s*$/m);
  if (match) knownIds.add(match[1]);
}

const res = await fetch(
  `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
  { signal: AbortSignal.timeout(10_000) },
);
if (!res.ok) throw new Error(`YouTube feed HTTP ${res.status}`);

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const doc = parser.parse(await res.text());
const entries = [doc?.feed?.entry ?? []].flat();

const newVideos = entries
  .map((entry) => ({
    videoId: entry["yt:videoId"],
    title: String(entry.title ?? ""),
    publishedAt: entry.published ?? "",
    description: String(entry["media:group"]?.["media:description"] ?? "").slice(0, 2000),
    url: `https://www.youtube.com/watch?v=${entry["yt:videoId"]}`,
  }))
  .filter((v) => v.videoId && !knownIds.has(v.videoId));

await mkdir(new URL(".", OUT_PATH), { recursive: true });
await writeFile(
  OUT_PATH,
  JSON.stringify({ checkedAt: new Date().toISOString(), videos: newVideos }, null, 2),
);

console.log(
  `${entries.length} videos in feed, ${knownIds.size} already have a post, ${newVideos.length} new → scratch/youtube-new.json`,
);
