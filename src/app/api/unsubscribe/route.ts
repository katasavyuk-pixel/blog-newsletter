import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { cancelWelcomeSequence } from "@/lib/welcome-sequence";

export const runtime = "nodejs";

async function doUnsubscribe(token: string | null): Promise<void> {
  if (!token || !isSupabaseConfigured()) return;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("id");
  // Cancel any onboarding emails still scheduled in Resend for this subscriber.
  for (const row of data ?? []) {
    await cancelWelcomeSequence(supabase, row.id);
  }
}

// One-click (RFC 8058): mail clients POST here and expect a 200 with no confirmation step.
export async function POST(request: NextRequest) {
  await doUnsubscribe(request.nextUrl.searchParams.get("token"));
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: NextRequest) {
  await doUnsubscribe(request.nextUrl.searchParams.get("token"));
  return NextResponse.redirect(new URL("/baja", request.url));
}
