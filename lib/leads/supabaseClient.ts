import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClientLike, SupabaseInsertRow } from "./submitLead";

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase server client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  cachedClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cachedClient;
}

export const supabaseLeadClient: SupabaseClientLike = {
  async insertLead(row: SupabaseInsertRow) {
    const { error } = await getClient().from("leads").insert(row);
    return { error: error ? { message: error.message } : null };
  },
  async countRecentLeadsByIp(ip, sinceIso) {
    const { count, error } = await getClient()
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("submitted_ip", ip)
      .gte("created_at", sinceIso);
    if (error) throw new Error(error.message);
    return count ?? 0;
  },
};
