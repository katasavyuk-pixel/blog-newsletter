import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { hashToken, generateToken } from "@/lib/tokens";
import { getResend, FROM, isEmailConfigured } from "@/lib/email";
import { WelcomeEmail } from "@/emails/welcome";
import { scheduleWelcomeSequence } from "@/lib/welcome-sequence";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const resource = request.nextUrl.searchParams.get("resource") ?? undefined;

  if (!token) {
    return NextResponse.redirect(new URL("/gracias?error=token", request.url));
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/gracias?preview=1", request.url));
  }

  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from("subscribers")
    .select("id, email, status, confirm_expires_at")
    .eq("confirm_token_hash", hashToken(token))
    .maybeSingle();

  if (
    !sub ||
    sub.status === "unsubscribed" ||
    !sub.confirm_expires_at ||
    new Date(sub.confirm_expires_at).getTime() <= Date.now()
  ) {
    return NextResponse.redirect(new URL("/gracias?error=expired", request.url));
  }

  const unsubscribeToken = generateToken();
  await supabase
    .from("subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirm_token_hash: null,
      confirm_expires_at: null,
      unsubscribe_token: unsubscribeToken,
    })
    .eq("id", sub.id);

  // Soft, session-less marker so a just-confirmed visitor can download lead magnets
  // (free-with-email gating; real access control for paid content arrives in Fase 3).
  (await cookies()).set("nbi_subscriber", sub.email, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  if (isEmailConfigured()) {
    await getResend().emails.send({
      from: FROM,
      to: sub.email,
      subject: `¡Bienvenido a ${siteConfig.name}!`,
      react: WelcomeEmail({
        brand: siteConfig.name,
        downloadUrl: resource
          ? `${siteConfig.url}/api/download?slug=${encodeURIComponent(resource)}`
          : undefined,
      }),
    });
  }

  // Onboarding drip (day 2 / 5 / 8) via Resend scheduledAt. Best-effort: skips
  // itself while migration 0002 is unapplied and never breaks the redirect.
  await scheduleWelcomeSequence(supabase, {
    id: sub.id,
    email: sub.email,
    unsubscribeToken,
  });

  const dest = resource
    ? `/gracias?descarga=${encodeURIComponent(resource)}`
    : "/gracias?confirmed=1";
  return NextResponse.redirect(new URL(dest, request.url));
}
