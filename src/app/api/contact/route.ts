import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getResend, FROM, isEmailConfigured } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/ratelimit";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

const BodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  message: z.string().min(1).max(2000),
  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(`contact:${ip}`)) {
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

  // Scaffolding mode (no Resend yet): report preview so the UI flow works.
  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: siteConfig.contactEmail,
      replyTo: body.email,
      subject: `Trabaja con NBI — mensaje de ${body.name}`,
      text: `De: ${body.name} <${body.email}>\n\n${body.message}`,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] resend threw:", err);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
