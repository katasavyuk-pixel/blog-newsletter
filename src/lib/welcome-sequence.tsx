import { sequenceEmails } from "#site/content";
import { NewsletterEmail } from "@/emails/newsletter";
import { getResend, FROM, REPLY_TO, isEmailConfigured } from "@/lib/email";
import type { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";
import { renderTemplate, htmlToText, TemplateError } from "@/lib/email-template";
import { openingBlock, downloadBlock } from "@/lib/email-blocks";
import { getLatestSubmission, type MagnetSubmission } from "@/lib/lead-magnets";
import { signedDownloadUrl } from "@/lib/signed-links";

type AdminClient = ReturnType<typeof createAdminClient>;

export type SequenceStep = (typeof sequenceEmails)[number];

/**
 * The onboarding sequence, read from content/emails/*.md at build time.
 *
 * Ordering is explicit (`order`) rather than filename-derived so renumbering a
 * step does not mean renaming files and losing the `key` that ties a sent email
 * to its row in `scheduled_emails`.
 */
export function getSequence(name = "bienvenida"): SequenceStep[] {
  return sequenceEmails
    .filter((step) => step.sequence === name && !step.draft)
    .sort((a, b) => a.order - b.order);
}

export type RenderContext = {
  siteUrl: string;
  submission: MagnetSubmission | null;
  downloadUrl: string | null;
  downloadLabel: string;
};

/**
 * Fill in a step's placeholders. Returns null when the copy references a
 * placeholder that does not exist — better one missing email than a visible
 * `{{typo}}` delivered to the whole list.
 */
export function renderStep(step: SequenceStep, ctx: RenderContext): string | null {
  try {
    return renderTemplate(step.html, {
      url_sitio: ctx.siteUrl,
      nombre_sitio: siteConfig.name,
      apertura_personalizada: openingBlock(ctx.siteUrl, ctx.submission),
      bloque_descarga: downloadBlock(ctx.downloadUrl, ctx.downloadLabel),
    });
  } catch (err) {
    if (err instanceof TemplateError) {
      console.error(`[welcome-sequence] ${step.key}: ${err.message}`);
      return null;
    }
    throw err;
  }
}

/**
 * Everything the copy might want to say back to this subscriber.
 *
 * Looked up once and reused for every step, so a three-email sequence costs one
 * read rather than three.
 */
export async function buildContext(
  supabase: AdminClient,
  email: string,
  resource?: string,
): Promise<RenderContext> {
  const submission = await getLatestSubmission(supabase, email);

  let downloadUrl: string | null = null;
  let downloadLabel = "Descargar el recurso";

  if (resource) {
    const { data } = await supabase
      .from("resources")
      .select("title")
      .eq("slug", resource)
      .eq("published", true)
      .maybeSingle();
    // Only offer the download if the resource really is published: a button
    // pointing at nothing is worse than no button, and it would arrive in the
    // one email the reader is most likely to open.
    if (data) {
      downloadLabel = (data.title as string) || downloadLabel;
      downloadUrl =
        signedDownloadUrl(siteConfig.url, resource, email) ??
        `${siteConfig.url}/api/download?slug=${encodeURIComponent(resource)}`;
    }
  }

  return { siteUrl: siteConfig.url, submission, downloadUrl, downloadLabel };
}

function unsubscribeUrlFor(token: string): string {
  return `${siteConfig.url}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

function messageFor(
  step: SequenceStep,
  html: string,
  to: string,
  unsubscribeUrl: string,
) {
  return {
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: step.subject,
    react: NewsletterEmail({
      brand: siteConfig.name,
      preview: step.preheader,
      title: step.title,
      unsubscribeUrl,
      children: <div dangerouslySetInnerHTML={{ __html: html }} />,
    }),
    // Plain-text alternative. An HTML-only email is a bulk-mail signal — the
    // sequence was landing in Gmail's Promotions tab — and clients that block
    // HTML show nothing at all without it.
    text: [
      step.title,
      "",
      htmlToText(html),
      `Cancelar suscripción: ${unsubscribeUrl}`,
    ].join("\n"),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

/**
 * Schedule the onboarding emails in Resend (`scheduledAt`, no cron needed) and
 * record their ids in `scheduled_emails` so an unsubscribe can cancel them.
 *
 * The step with `delayHours: 0` is sent immediately. It replaces the separate
 * "welcome" email that used to go out here, which shipped without a
 * List-Unsubscribe header or a visible unsubscribe link — going through the
 * shared shell fixes that as a side effect of moving the copy into a file.
 *
 * Best-effort by design: the double opt-in flow must never fail because of the
 * sequence, and while `scheduled_emails` does not exist the whole thing is
 * silently skipped.
 */
export async function scheduleWelcomeSequence(
  supabase: AdminClient,
  sub: {
    id: string;
    email: string;
    unsubscribeToken: string;
    resource?: string;
  },
): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const { data: existing, error } = await supabase
      .from("scheduled_emails")
      .select("email_key")
      .eq("subscriber_id", sub.id)
      .limit(1);
    if (error) return; // table missing or transient failure → skip, don't break confirm

    // Any row at all means this subscriber already went through the sequence.
    //
    // This used to compare key by key. That was safe only while the keys never
    // changed: renaming d2-curso → w2-historia would have made every existing
    // subscriber look un-enrolled and sent them the whole sequence a second
    // time. Consent cycles are per subscriber, not per step, so this is the
    // condition that actually matches the intent.
    if (existing && existing.length > 0) return;

    const steps = getSequence();
    if (steps.length === 0) return;

    const ctx = await buildContext(supabase, sub.email, sub.resource);
    const unsubscribeUrl = unsubscribeUrlFor(sub.unsubscribeToken);
    const resend = getResend();

    for (const step of steps) {
      const html = renderStep(step, ctx);
      if (html === null) continue;

      const immediate = step.delayHours === 0;
      const scheduledAt = new Date(
        Date.now() + step.delayHours * 60 * 60 * 1000,
      ).toISOString();

      const { data: sent, error: sendError } = await resend.emails.send({
        ...messageFor(step, html, sub.email, unsubscribeUrl),
        ...(immediate ? {} : { scheduledAt }),
      });
      if (sendError || !sent) continue;

      await supabase.from("scheduled_emails").insert({
        subscriber_id: sub.id,
        email_key: step.key,
        resend_email_id: sent.id,
        scheduled_at: scheduledAt,
      });
    }
  } catch {
    // Never let onboarding emails break the opt-in redirect.
  }
}

/**
 * Cancel any still-pending sequence emails for a subscriber and drop the rows.
 * Deleting (not marking) means a future re-subscription is a fresh consent
 * cycle and gets the sequence again.
 */
export async function cancelWelcomeSequence(
  supabase: AdminClient,
  subscriberId: string,
): Promise<void> {
  try {
    const { data: rows, error } = await supabase
      .from("scheduled_emails")
      .select("resend_email_id, scheduled_at")
      .eq("subscriber_id", subscriberId);
    if (error || !rows?.length) return;

    if (isEmailConfigured()) {
      const resend = getResend();
      const pending = rows.filter(
        (r) =>
          r.resend_email_id &&
          new Date(r.scheduled_at).getTime() > Date.now(),
      );
      for (const r of pending) {
        try {
          await resend.emails.cancel(r.resend_email_id);
        } catch {
          // Already sent or already cancelled — nothing to do.
        }
      }
    }

    await supabase
      .from("scheduled_emails")
      .delete()
      .eq("subscriber_id", subscriberId);
  } catch {
    // Best-effort: never block the one-click unsubscribe response.
  }
}

/**
 * Send the whole sequence at once to one address, for review.
 *
 * Writes nothing: no subscriber, no scheduled_emails rows, no Resend schedule.
 * The unsubscribe token is deliberately fake — /api/unsubscribe updates zero
 * rows for an unknown token, so the footer link is inert rather than dangerous.
 *
 * Uses the same render path as production. A preview that renders differently
 * from the real thing is worse than no preview.
 */
export async function sendSequencePreview(
  supabase: AdminClient,
  input: { email: string; resource?: string; dryRun?: boolean },
): Promise<{ key: string; subject: string; html?: string; sent?: boolean; error?: string }[]> {
  const steps = getSequence();
  const ctx = await buildContext(supabase, input.email, input.resource);
  const unsubscribeUrl = unsubscribeUrlFor("preview-token-no-valido");
  const results = [];

  for (const step of steps) {
    const html = renderStep(step, ctx);
    if (html === null) {
      results.push({
        key: step.key,
        subject: step.subject,
        error: "placeholder sin resolver — mira los logs del servidor",
      });
      continue;
    }
    if (input.dryRun) {
      results.push({ key: step.key, subject: step.subject, html });
      continue;
    }
    const { error } = await getResend().emails.send(
      messageFor(
        { ...step, subject: `[PRUEBA] ${step.subject}` },
        html,
        input.email,
        unsubscribeUrl,
      ),
    );
    results.push({
      key: step.key,
      subject: step.subject,
      sent: !error,
      ...(error ? { error: error.message } : {}),
    });
  }

  return results;
}
