/**
 * Placeholder substitution for the markdown-authored sequence emails.
 *
 * The copy lives in content/emails/*.md so it can be edited without touching
 * TypeScript. But the first email has to say the reader's own numbers back to
 * them, and markdown cannot do that. Rather than reach for a templating engine,
 * a fixed, documented set of `{{names}}` gets replaced with pre-rendered HTML.
 *
 * The strict part matters: an unknown or misspelled placeholder **throws**. The
 * alternative is shipping a literal `{{desglse}}` to every subscriber, and there
 * is no way to unsend that. Callers catch the error and skip the step, so a typo
 * costs one missing email rather than a visibly broken one.
 */

export class TemplateError extends Error {}

export type TemplateVars = Record<string, string>;

const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/g;

/**
 * Replace every `{{name}}` in `html`, or throw.
 *
 * A placeholder alone on its own markdown line becomes `<p>{{name}}</p>`. Block
 * replacements (a table, a button) cannot legally live inside a `<p>`, so the
 * wrapping paragraph is consumed too. That also means an empty replacement
 * leaves no orphan paragraph behind, which is how "no download for this reader"
 * renders as nothing at all instead of a stray gap.
 */
export function renderTemplate(html: string, vars: TemplateVars): string {
  let out = html;

  for (const [name, value] of Object.entries(vars)) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(
      new RegExp(`<p>\\s*\\{\\{\\s*${escaped}\\s*\\}\\}\\s*</p>`, "g"),
      value,
    );
    out = out.replace(
      new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, "g"),
      value,
    );
  }

  const leftover = [...out.matchAll(PLACEHOLDER)].map((m) => m[1]);
  if (leftover.length > 0) {
    throw new TemplateError(
      `Placeholder sin resolver: ${[...new Set(leftover)].join(", ")}. ` +
        `Revisa el nombre en content/emails/ — los válidos son: ${Object.keys(vars).join(", ")}.`,
    );
  }

  return out;
}

/**
 * Plain-text alternative for an email body.
 *
 * Every message should carry one. Two reasons, and the first is the one that
 * costs money: a `text/html`-only email is a bulk-mail signal, and the welcome
 * sequence was landing in Gmail's Promotions tab. The second is that some clients
 * block HTML entirely, and for them an HTML-only email is a blank message.
 *
 * Derived from the rendered HTML rather than from the markdown source on purpose:
 * that way it includes the personalised blocks (the reader's own cost breakdown,
 * the download link) and cannot drift from what the HTML says.
 *
 * Links become "texto (url)" because a plain-text reader cannot click anything —
 * a bare anchor text would leave them with no way to reach the page.
 */
export function htmlToText(html: string): string {
  return (
    html
      // Table rows read as "label: value" — that is what the cost breakdown is.
      .replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, ": ")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, text) => {
        const label = text.replace(/<[^>]+>/g, "").trim();
        if (!label) return href;
        return href.startsWith("mailto:") ? label : `${label} (${href})`;
      })
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr|table|section)>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

/** Escape text destined for an HTML attribute or text node. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
