import { NewsletterEmail } from "@/emails/newsletter";
import { WELCOME_SEQUENCE } from "@/emails/welcome-sequence";
import { getResend, FROM, REPLY_TO, isEmailConfigured } from "@/lib/email";
import type { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Schedule the onboarding emails in Resend (`scheduledAt`, no cron needed) and
 * record their ids in `scheduled_emails` so an unsubscribe can cancel them.
 *
 * Best-effort by design: the double opt-in flow must never fail because of the
 * sequence, and while the `scheduled_emails` table doesn't exist yet (migration
 * 0002 pending) the whole thing is silently skipped.
 */
export async function scheduleWelcomeSequence(
  supabase: AdminClient,
  sub: { id: string; email: string; unsubscribeToken: string },
): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const { data: existing, error } = await supabase
      .from("scheduled_emails")
      .select("email_key")
      .eq("subscriber_id", sub.id);
    if (error) return; // table missing or transient failure → skip, don't break confirm
    const alreadyScheduled = new Set(existing?.map((r) => r.email_key));

    const unsubscribeUrl = `${siteConfig.url}/api/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
    const resend = getResend();

    for (const step of WELCOME_SEQUENCE) {
      if (alreadyScheduled.has(step.key)) continue;
      const scheduledAt = new Date(
        Date.now() + step.delayDays * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { data: sent, error: sendError } = await resend.emails.send({
        from: FROM,
        to: sub.email,
        replyTo: REPLY_TO,
        subject: step.subject,
        react: NewsletterEmail({
          brand: siteConfig.name,
          preview: step.preview,
          title: step.title,
          unsubscribeUrl,
          children: step.content({ siteUrl: siteConfig.url }),
        }),
        scheduledAt,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
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
