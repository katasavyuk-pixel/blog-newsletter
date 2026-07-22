import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

/**
 * Confirmed-subscriber count for the journey status panel. Needs service_role
 * (the table has no anon policies), so admin client + graceful null when the
 * env is absent — same degradation contract as resources.ts. The home opts
 * into ISR (revalidate) so the number refreshes without a redeploy.
 */
export async function getConfirmedSubscriberCount(): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed");
    if (error) return null;
    return count;
  } catch {
    return null;
  }
}
