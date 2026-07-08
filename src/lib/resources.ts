import { createClient } from "@/lib/supabase/server";

export type Resource = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  requires_email: boolean;
  download_count: number;
};

/** Published lead magnets. Returns [] when Supabase isn't configured yet (Fase 0/scaffolding). */
export async function getPublishedResources(): Promise<Resource[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return [];
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("id, slug, title, description, requires_email, download_count")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data as Resource[] | null) ?? [];
}
