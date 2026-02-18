'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/auth-client';
import { DashboardLayout } from '@/components/DashboardLayout';

const titles: Record<string, string> = {
  '/dashboard': 'Daftar Produk',
  '/dashboard/tambah': 'Tambah Produk',
};

function getTitle(pathname: string) {
  if (pathname?.startsWith('/dashboard/produk/')) return 'Edit Produk';
  return titles[pathname ?? ''] ?? 'Dashboard';
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    getSession().then(({ accessToken, error }) => {
      if (error || !accessToken) {
        router.replace('/login');
        return;
      }
      setAllowed(true);
    });
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title={getTitle(pathname ?? '')}>
      {children}
    </DashboardLayout>
  );
}
