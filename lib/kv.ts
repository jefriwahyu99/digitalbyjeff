import { createServerSupabase } from '@/lib/supabase/server';

const KV_TABLE = 'kv_store_f7b45995';

export async function kvSet(key: string, value: Record<string, unknown>): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from(KV_TABLE).upsert({ key, value });
  if (error) throw new Error(error.message);
}

export async function kvGet(key: string): Promise<Record<string, unknown> | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.value as Record<string, unknown>) ?? null;
}

export async function kvDel(key: string): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from(KV_TABLE).delete().eq('key', key);
  if (error) throw new Error(error.message);
}

/** Returns array of { key, value } for keys matching prefix (e.g. "product:") */
export async function kvGetByPrefix(
  prefix: string
): Promise<{ key: string; value: Record<string, unknown> }[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', `${prefix}%`);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    key: row.key as string,
    value: row.value as Record<string, unknown>,
  }));
}
