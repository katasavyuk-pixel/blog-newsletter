import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const supabase = createAdminClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("id, file_path, requires_email")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!resource) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (resource.requires_email) {
    const email = (await cookies()).get("nbi_subscriber")?.value;
    let confirmed = false;
    if (email) {
      const { data: sub } = await supabase
        .from("subscribers")
        .select("status")
        .eq("email", email)
        .maybeSingle();
      confirmed = sub?.status === "confirmed";
    }
    if (!confirmed) {
      return NextResponse.redirect(
        new URL(`/recursos?need_email=${encodeURIComponent(slug)}`, request.url),
      );
    }
  }

  const { data: signed } = await supabase.storage
    .from("lead-magnets")
    .createSignedUrl(resource.file_path, 300, { download: true });

  if (!signed?.signedUrl) {
    return NextResponse.json({ error: "signing failed" }, { status: 500 });
  }

  await supabase.rpc("increment_download_count", { p_id: resource.id });
  return NextResponse.redirect(signed.signedUrl);
}
