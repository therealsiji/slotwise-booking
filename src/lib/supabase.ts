import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase URL and anon key are not configured.");
  }

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return browserClient;
}
