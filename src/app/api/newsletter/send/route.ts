import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { NewsletterError, sendIssue } from "@/lib/newsletter";

export const runtime = "nodejs";

const BodySchema = z.object({
  issue: z.string().max(60),
  dryRun: z.boolean().optional(),
});

/**
 * Broadcast one newsletter issue to the confirmed list.
 *
 * Triggered by hand, on purpose: the newsletter is fortnightly and every issue
 * gets read before it goes out, so a cron would only add a way to send
 * something nobody reviewed.
 *
 *   curl -X POST https://kata.ianexora.com/api/newsletter/send \
 *     -H "Authorization: Bearer $NEWSLETTER_SEND_SECRET" \
 *     -H 'Content-Type: application/json' \
 *     -d '{"issue":"2026-08-antes-del-tms","dryRun":true}'
 *
 * Always dry-run first: it reports how many people would receive it without
 * sending anything.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.NEWSLETTER_SEND_SECRET;

  // Fails closed. An unset secret disables the endpoint rather than opening it —
  // the opposite of the Turnstile guard, because the blast radius here is the
  // whole list and it cannot be undone.
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "NEWSLETTER_SEND_SECRET no configurado" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "no autorizado" }, { status: 401 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const result = await sendIssue(body.issue, { dryRun: body.dryRun ?? false });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof NewsletterError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
    }
    console.error("[newsletter] error inesperado:", err);
    return NextResponse.json({ ok: false, error: "error interno" }, { status: 500 });
  }
}
