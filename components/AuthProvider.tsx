'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession } from '@/lib/auth-client';

type AuthContextType = {
  accessToken: string | null;
  isLoading: boolean;
  setAccessToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then(({ accessToken: t, error }) => {
      setAccessToken(t ?? null);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, isLoading, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
