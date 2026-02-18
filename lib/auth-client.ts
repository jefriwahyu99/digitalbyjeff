'use client';

import { supabase } from '@/lib/supabase/client';

export interface AuthResponse {
  accessToken?: string;
  error?: string;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  if (!data.session?.access_token) return { error: 'No access token received' };
  return { accessToken: data.session.access_token };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { error: error.message };
  if (!data.session?.access_token) return { error: 'No active session' };
  return { accessToken: data.session.access_token };
}
