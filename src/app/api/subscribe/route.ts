import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { generateToken, hashToken } from "@/lib/tokens";
import { getResend, FROM, REPLY_TO, isEmailConfigured } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/ratelimit";
import { ConfirmOptInEmail } from "@/emails/confirm-opt-in";
import { siteConfig } from "@/config/site";
import { recordSubmission } from "@/lib/lead-magnets";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(80).optional(),
  resource: z.string().max(80).optional(),
  utmSource: z.string().max(80).optional(),
  turnstileToken: z.string().optional(),
  /** Literal route the signup happened on, e.g. "/blog/que-es-rag". */
  signupPath: z
    .string()
    .max(120)
    .regex(/^\/[\w\-/]*$/)
    .optional(),
  /** The separate, non-prechecked consent box (RGPD art. 6.1.a, Planet49). */
  consent: z.literal(true).optional(),
  /** Lead magnet this capture belongs to, when a widget produced something. */
  magnetSlug: z.string().max(80).optional(),
  /**
   * Whatever the widget wants remembered. Deliberately `unknown`: it is parsed
   * and *recomputed* per magnet in `recordSubmission`, never written as sent.
   */
  payload: z.unknown().optional(),
});

const ok = () => NextResponse.json({ ok: true });

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(`subscribe:${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  // The checkbox has always been `required` in the markup, but the value never
  // reached the server, so a hand-rolled POST could subscribe an address with no
  // consent recorded anywhere. Double opt-in is our proof of lawful basis; it
  // should not rest on client-side validation alone.
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "consent" }, { status: 400 });
  }

  // Scaffolding mode (no Supabase/Resend yet): report preview so the UI flow works.
  if (!isSupabaseConfigured() || !isEmailConfigured()) {
    return NextResponse.json({ ok: true, preview: true });
  }

  const supabase = createAdminClient();
  const magnet = body.resource ?? body.magnetSlug;
  const baseSource = magnet ? `lead_magnet:${magnet}` : body.source ?? "site";
  const source = body.utmSource
    ? `${baseSource}:${body.utmSource}`
    : baseSource;

  // Recorded before touching `subscribers` so a fast confirm always finds it:
  // the welcome email looks this up by email to quote the reader's own numbers.
  // Best-effort, like the onboarding sequence — a capture must never be the
  // reason a subscription fails.
  if (body.magnetSlug) {
    await recordSubmission(supabase, {
      email: body.email,
      magnetSlug: body.magnetSlug,
      payload: body.payload,
      sourcePath: body.signupPath,
    });
  }

  const { data: existing } = await supabase
    .from("subscribers")
    .select("status")
    .eq("email", body.email)
    .maybeSingle();

  // Already confirmed → don't resend; respond generically (anti-enumeration).
  // The submission above is still recorded: someone who consented months ago and
  // now asks for a breakdown has asked for something, and the delivery path for
  // that case is the immediate onboarding email (see /api/confirm).
  if (existing?.status === "confirmed") return ok();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const row = {
    email: body.email,
    status: "pending",
    confirm_token_hash: hashToken(token),
    confirm_expires_at: expiresAt,
    consent_ip: ip === "unknown" ? null : ip,
    source,
    locale: siteConfig.locale,
  };

  // `signup_path` arrives with migration 0005, which is applied by hand. Deploys
  // and migrations are not atomic here, so between the two an upsert naming that
  // column errors — and since the result was never checked, we would happily
  // send a confirmation email carrying a token that was never stored. The reader
  // clicks it and gets "enlace no válido", for a subscription that never
  // existed. Retry without the column rather than lose the signup.
  let { error } = await supabase
    .from("subscribers")
    .upsert({ ...row, signup_path: body.signupPath ?? null }, { onConflict: "email" });

  if (error) {
    ({ error } = await supabase
      .from("subscribers")
      .upsert(row, { onConflict: "email" }));
  }

  if (error) {
    console.error("[subscribe] upsert failed:", error);
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }

  const confirmUrl =
    `${siteConfig.url}/api/confirm?token=${token}` +
    (body.resource ? `&resource=${encodeURIComponent(body.resource)}` : "");

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: body.email,
      // FROM is a send-only subdomain: without this, a reply to the very first
      // email anyone gets from the site goes nowhere. Only the welcome sequence
      // set it, so the two emails that arrive before it were silent dead ends.
      replyTo: REPLY_TO,
      subject: `Confirma tu suscripción a ${siteConfig.name}`,
      react: ConfirmOptInEmail({ confirmUrl, brand: siteConfig.name }),
    });
    if (error) {
      console.error("[subscribe] resend error:", error);
      return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[subscribe] resend threw:", err);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
  }

  return ok();
}
