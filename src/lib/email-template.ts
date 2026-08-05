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

/** Escape text destined for an HTML attribute or text node. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
