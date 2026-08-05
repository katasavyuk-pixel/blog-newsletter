import { newsletters } from "#site/content";
import { NewsletterEmail } from "@/emails/newsletter";
import { getResend, FROM, REPLY_TO, isEmailConfigured } from "@/lib/email";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { siteConfig } from "@/config/site";

/** Resend caps a batch at 100 messages. */
const BATCH_SIZE = 100;
/** Resend allows 5 requests/second; 250ms between batches stays under it. */
const BATCH_INTERVAL_MS = 250;

export type NewsletterIssue = (typeof newsletters)[number];

export type SendResult = {
  issue: string;
  recipients: number;
  sent: number;
  failed: number;
  dryRun: boolean;
};

export class NewsletterError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Issues are opt-in to sending: `draft` defaults to true in the schema. */
export function getSendableIssue(issueId: string): NewsletterIssue {
  const issue = newsletters.find((n) => n.issue === issueId);
  if (!issue) throw new NewsletterError(`Issue "${issueId}" no existe`, 404);
  if (issue.draft) {
    throw new NewsletterError(
      `Issue "${issueId}" sigue en draft. Quita \`draft: true\` cuando esté lista.`,
      409,
    );
  }
  return issue;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Send one issue to every confirmed subscriber.
 *
 * Why a loop of our own instead of a Resend audience: the list — the PII — stays
 * in our EU Postgres, and Resend only ever sees the addresses it is delivering
 * to right now. That is the whole reason the subscriber table exists here.
 *
 * Idempotency is layered, because mailing a list twice cannot be undone:
 *  1. `newsletter_issues.issue_id` is a primary key, and it is inserted BEFORE
 *     the first send. A second run loses the insert race and aborts.
 *  2. Every batch carries a Resend `idempotencyKey`, so a retry after a network
 *     failure mid-flight does not duplicate that batch.
 */
export async function sendIssue(
  issueId: string,
  { dryRun = false }: { dryRun?: boolean } = {},
): Promise<SendResult> {
  const issue = getSendableIssue(issueId);

  if (!isSupabaseConfigured()) {
    throw new NewsletterError("Supabase no está configurado", 503);
  }
  if (!isEmailConfigured() && !dryRun) {
    throw new NewsletterError("Resend no está configurado", 503);
  }

  const supabase = createAdminClient();

  const { data: recipients, error: readError } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("status", "confirmed");

  if (readError) {
    throw new NewsletterError(`No se pudo leer la lista: ${readError.message}`, 500);
  }

  const list = (recipients ?? []).filter((r) => r.email && r.unsubscribe_token);

  if (dryRun) {
    return { issue: issueId, recipients: list.length, sent: 0, failed: 0, dryRun: true };
  }

  if (list.length === 0) {
    throw new NewsletterError("No hay suscriptores confirmados", 409);
  }

  // Claim the issue first. If this fails on the primary key, it has already
  // gone out and we must not send it again.
  const { error: claimError } = await supabase.from("newsletter_issues").insert({
    issue_id: issue.issue,
    subject: issue.subject,
    recipient_count: list.length,
  });
  if (claimError) {
    throw new NewsletterError(
      `La edición "${issue.issue}" ya se envió (o no se pudo registrar): ${claimError.message}`,
      409,
    );
  }

  const resend = getResend();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const chunk = list.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((r) => {
      const unsubscribeUrl = `${siteConfig.url}/api/unsubscribe?token=${encodeURIComponent(
        r.unsubscribe_token,
      )}`;
      return {
        from: FROM,
        to: r.email,
        replyTo: REPLY_TO,
        subject: issue.subject,
        react: NewsletterEmail({
          brand: siteConfig.name,
          preview: issue.preheader,
          title: issue.title,
          unsubscribeUrl,
          siteUrl: siteConfig.url,
          // Broadcasts carry the standard closing; the onboarding sequence does
          // not (its last email is the offer). See NewsletterEmail.
          showClosing: true,
          children: <div dangerouslySetInnerHTML={{ __html: issue.html }} />,
        }),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    try {
      const { error } = await resend.batch.send(payload, {
        idempotencyKey: `${issue.issue}:${i / BATCH_SIZE}`,
      });
      if (error) {
        failed += chunk.length;
        console.error(`[newsletter] batch ${i / BATCH_SIZE} falló:`, error);
      } else {
        sent += chunk.length;
      }
    } catch (err) {
      failed += chunk.length;
      console.error(`[newsletter] batch ${i / BATCH_SIZE} lanzó:`, err);
    }

    if (i + BATCH_SIZE < list.length) await sleep(BATCH_INTERVAL_MS);
  }

  if (failed > 0) {
    await supabase
      .from("newsletter_issues")
      .update({ failed_count: failed })
      .eq("issue_id", issue.issue);
  }

  return { issue: issue.issue, recipients: list.length, sent, failed, dryRun: false };
}
