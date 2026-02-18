import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json(
        { error: `Signup failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: data.user,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signup error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
