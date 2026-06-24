import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { transformerNotationDiff } from "@shikijs/transformers";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      cover: s.image().optional(),
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

export default defineConfig({
  root: "content",
  collections: { posts },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Light theme only (brand law: never dark). Code surface styled in globals.css.
          theme: "github-light",
          keepBackground: false,
          transformers: [transformerNotationDiff()],
        },
      ],
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
    ],
    remarkPlugins: [remarkGfm],
  },
});
