'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth-client';
import { createProduct } from '@/lib/api-client';
import { ProductForm } from '@/components/ProductForm';
import { toast } from 'sonner';
import type { Product } from '@/lib/api-client';

export default function TambahProdukPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getSession().then(({ accessToken }) => {
      setToken(accessToken ?? null);
    });
  }, []);

  const handleSave = async (data: Omit<Product, 'id'> & { id?: string }) => {
    if (!token) return;
    const { data: product, error } = await createProduct(token, {
      judul: data.judul,
      deskripsi: data.deskripsi,
      harga: data.harga,
      foto: data.foto,
      kategori: data.kategori,
      badge: data.badge,
    });
    if (error) {
      toast.error('Gagal menambah produk', { description: error });
      return;
    }
    toast.success('Produk berhasil ditambahkan');
    router.push('/dashboard');
    router.refresh();
  };

  if (!token) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Memuat...</p>
      </div>
    );
  }

  return <ProductForm mode="add" onSave={handleSave} />;
}
