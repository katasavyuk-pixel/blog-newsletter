import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { generateToken, hashToken } from "@/lib/tokens";
import { getResend, FROM, isEmailConfigured } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/ratelimit";
import { ConfirmOptInEmail } from "@/emails/confirm-opt-in";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(80).optional(),
  resource: z.string().max(80).optional(),
  turnstileToken: z.string().optional(),
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

  // Scaffolding mode (no Supabase/Resend yet): report preview so the UI flow works.
  if (!isSupabaseConfigured() || !isEmailConfigured()) {
    return NextResponse.json({ ok: true, preview: true });
  }

  const supabase = createAdminClient();
  const source = body.resource
    ? `lead_magnet:${body.resource}`
    : body.source ?? "site";

  const { data: existing } = await supabase
    .from("subscribers")
    .select("status")
    .eq("email", body.email)
    .maybeSingle();

  // Already confirmed → don't resend; respond generically (anti-enumeration).
  if (existing?.status === "confirmed") return ok();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("subscribers").upsert(
    {
      email: body.email,
      status: "pending",
      confirm_token_hash: hashToken(token),
      confirm_expires_at: expiresAt,
      consent_ip: ip === "unknown" ? null : ip,
      source,
      locale: siteConfig.locale,
    },
    { onConflict: "email" },
  );

  const confirmUrl =
    `${siteConfig.url}/api/confirm?token=${token}` +
    (body.resource ? `&resource=${encodeURIComponent(body.resource)}` : "");

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: body.email,
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
