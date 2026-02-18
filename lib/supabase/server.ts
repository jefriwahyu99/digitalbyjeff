import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Hanya dipakai di server (API routes, server components). Jangan pakai di client. */
export function createServerSupabase() {
  return createClient(supabaseUrl, serviceRoleKey);
}
