import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { transformerNotationDiff } from "@shikijs/transformers";
// Relative, not "@/": velite compiles this config in its own esbuild pass and
// does not read the tsconfig path aliases.
import { FORMATO_KEYS, TEMA_KEYS } from "./src/config/taxonomy";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300),
      kicker: s.string().max(40).optional(), // small-caps category label (magazine header)
      dek: s.string().max(300).optional(), // standfirst / intro under the headline
      date: s.isodate(),
      updated: s.isodate().optional(),
      // Closed vocabulary, both required: a mistyped tema fails the build rather
      // than creating a category of one. Free `tags` stay as secondary keywords.
      tema: s.enum(TEMA_KEYS),
      formato: s.enum(FORMATO_KEYS),
      tags: s.array(s.string()).default([]),
      cover: s.image().optional(),
      youtubeId: s.string().max(20).optional(), // companion YouTube video ID, if any
      draft: s.boolean().default(false),
      premium: s.boolean().default(false),
      path: s.path(),
      toc: s.toc(),
      metadata: s.metadata(), // { readingTime, wordCount }
      excerpt: s.excerpt(),
      content: s.mdx(),
    })
    .transform((data) => {
      const slug = data.path.replace(/^posts\//, "");
      return { ...data, slug, permalink: `/blog/${slug}` };
    }),
});

/**
 * Newsletter issues. Plain markdown, not MDX: this renders into an email, where
 * interactive widgets cannot run and `s.markdown()` gives us the HTML string an
 * email client actually needs.
 *
 * An issue is a file so it is versioned, reviewable in a PR and diffable —
 * the same contract as a post. `issue` is the idempotency key: the broadcast
 * refuses to send one twice.
 */
const newsletters = defineCollection({
  name: "NewsletterIssue",
  pattern: "newsletters/**/*.md",
  schema: s.object({
    issue: s.string().max(60), // stable id, never reuse
    subject: s.string().max(120),
    preheader: s.string().max(200),
    title: s.string().max(120),
    date: s.isodate(),
    draft: s.boolean().default(true), // opt IN to sending, never out
    html: s.markdown(),
  }),
});

export default defineConfig({
  root: "content",
  collections: { posts, newsletters },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Dark theme ("Kata Pro" red/black). Code surface styled in globals.css.
          theme: "github-dark",
          keepBackground: false,
          transformers: [transformerNotationDiff()],
        },
      ],
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
    ],
    remarkPlugins: [remarkGfm],
  },
});
