import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Author block at the foot of every article.
 *
 * Reuses `siteConfig.author.bio` — the credential already exists in one place and
 * this is not the file to write a second version of it.
 *
 * Doubles as an authorship signal: a named author with a concrete credential next
 * to the article body is one of the few things that reliably distinguishes a page
 * written by someone from a page assembled by nobody.
 */
export function AuthorBio() {
  return (
    <aside className="not-prose mt-14 rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
        Quién escribe esto
      </p>
      <p className="mt-2 font-display text-base font-semibold text-fg">
        {siteConfig.author.name}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {siteConfig.author.bio}
      </p>
      <Link
        href="/sobre-mi"
        className="mt-3 inline-block font-mono text-sm text-accent-ink hover:underline"
      >
        ▸ Más sobre mí
      </Link>
    </aside>
  );
}
