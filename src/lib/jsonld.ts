/**
 * Structured data builders.
 *
 * Centralised for one reason above the others: the `<` → `\u003c` escape. An
 * unescaped `<` inside a JSON-LD script tag is an XSS vector, the article page
 * did that escape at the call site, and the next page to emit JSON-LD would have
 * had to remember. `jsonLdScript()` does it once, so nothing can skip it.
 *
 * Deliberately NOT here, and not anywhere yet:
 *
 * - **`WebSite` + `SearchAction`.** There is no search on this site. Declaring a
 *   search endpoint that does not exist is a lie a machine can check.
 * - **`FAQPage` on any current page.** `faqJsonLd` exists and has no callers: no
 *   article has a real question-and-answer block. The `<Quiz>` widgets are
 *   exercises, not FAQs, and marking them up as FAQs would be structured spam on
 *   a site whose argument is that its claims are checkable.
 *
 * The `Person` node with `sameAs` used to be listed here as withheld episode-1
 * material; that episode was recorded (and pivoted to MaitreAI), so the
 * withholding reason expired and the node shipped on 2026-08-21.
 */

import { siteConfig } from "@/config/site";

type Json = Record<string, unknown>;

/** Serialise for a <script type="application/ld+json"> body. */
export function jsonLdScript(data: Json | Json[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * `TechArticle` for lessons and systems, `Article` otherwise.
 *
 * TechArticle is the honest type for a piece whose body is a runnable
 * explanation with code and interactive widgets; a radar edition or a note is
 * not that.
 *
 * Also used by the newsletter archive pages — an edition on the open web is an
 * article. Issues don't declare a word count, so `wordCount` is optional and
 * omitted rather than zeroed: a 0 in machine-readable data asserts something
 * false, and the field is simply absent instead.
 */
export function articleJsonLd(post: {
  title: string;
  description: string;
  date: string;
  updated?: string;
  formato: string;
  tags: string[];
  permalink: string;
  metadata: { wordCount?: number };
}): Json {
  const url = `${siteConfig.url}${post.permalink}`;
  const technical = post.formato === "leccion" || post.formato === "sistema";

  return {
    "@context": "https://schema.org",
    "@type": technical ? "TechArticle" : "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "es-ES",
    ...(post.metadata.wordCount
      ? { wordCount: post.metadata.wordCount }
      : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    author: { "@type": "Person", name: siteConfig.author.name },
    publisher: { "@type": "Person", name: siteConfig.author.name },
    mainEntityOfPage: url,
    url,
  };
}

/**
 * The site itself.
 *
 * Name, url, description, language — and nothing else. No `SearchAction`,
 * because there is no search. The publisher's identity lives in the Person
 * node below, which the home emits alongside this one.
 */
export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "es-ES",
  };
}

/**
 * The author as a resolvable entity: one node, on the home, tying the site to
 * the social profiles via `sameAs`.
 *
 * This is the cheapest entity-clarity lever in GEO: an answer engine that can
 * resolve "Kata Ivanovych" across LinkedIn/X/GitHub stops guessing whether the
 * name on an article is a person, a brand or a typo. It reads `siteConfig.social`
 * — the same list the footer renders — so a profile added there appears here
 * without a second edit, and the two can never disagree.
 *
 * No `jobTitle` on purpose: the approved vocabulary describes the activity
 * ("construyo NBI, mi negocio…"), never a role inside a legal entity, and
 * `QUE_PUEDO_DECIR.md` forbids resolving a new case by analogy. The bio —
 * already compliance-checked copy — carries the whole identity.
 */
export function personJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    url: siteConfig.url,
    description: siteConfig.author.bio,
    knowsLanguage: "es",
    ...(siteConfig.social.length > 0
      ? { sameAs: siteConfig.social.map((link) => link.href) }
      : {}),
  };
}

/** Breadcrumbs. `path` values are site-relative and absolutised here. */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${siteConfig.url}${step.path}`,
    })),
  };
}

/**
 * A glossary entry is a DefinedTerm, which is what it actually is — a named
 * concept with a definition, part of a set. Unlike FAQPage this needs no
 * invention: the data already exists in src/lib/glossary.ts.
 */
export function definedTermJsonLd(entry: {
  id: string;
  title: string;
  def: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${siteConfig.url}/glosario/${entry.id}`,
    name: entry.title,
    description: entry.def,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glosario de IA",
      url: `${siteConfig.url}/glosario`,
    },
  };
}

/**
 * FAQPage. Currently has no callers — see the note at the top of this file.
 * Use it the day an article carries a real "## Preguntas frecuentes" block.
 */
export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
