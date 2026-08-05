import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import type { CtaInline } from "@/config/cta-inline";

/**
 * Subscription ask placed inside the article body.
 *
 * In the body on purpose, not in the sticky rail and not only at the foot: a
 * reader who is halfway through and finding it useful is the one most likely to
 * want the next one. Before this, six of the nine published articles — every
 * lesson — had no email field anywhere on the page, including the one hosting the
 * cost calculator.
 *
 * The copy comes from the post's frontmatter, resolved in page.tsx (the MDX body
 * cannot see its own frontmatter, so the component is bound to the post where
 * the components map is built). One typed field, like everywhere else.
 *
 * `not-prose` because it sits inside Prose and should not inherit article
 * typography.
 */
export function SuscripcionInline({ gancho, promesa }: CtaInline) {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-border bg-surface p-6 sm:p-7">
      <p className="font-display text-lg font-semibold text-fg">{gancho}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{promesa}</p>
      <div className="mt-4">
        <SubscribeForm source="post-inline" />
      </div>
    </aside>
  );
}
