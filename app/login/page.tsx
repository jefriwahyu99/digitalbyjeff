'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const { accessToken, error } = await signIn(email, password);
    if (error) {
      toast.error('Login gagal', { description: error });
      return false;
    }
    if (accessToken) {
      toast.success('Login berhasil!');
      router.push('/dashboard');
      router.refresh();
      return true;
    }
    return false;
  };

  return <LoginForm onLogin={handleLogin} />;
}
