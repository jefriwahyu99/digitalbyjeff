'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth-client';
import { getProducts, updateProduct, deleteProduct } from '@/lib/api-client';
import { ProductForm } from '@/components/ProductForm';
import { toast } from 'sonner';
import type { Product } from '@/lib/api-client';

export default function EditProdukPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(({ accessToken }) => setToken(accessToken ?? null));
  }, []);

  useEffect(() => {
    if (!token) return;
    getProducts(token).then(({ data }) => {
      const p = data?.find((x) => x.id === id) ?? null;
      setProduct(p);
      setLoading(false);
    });
  }, [token, id]);

  const handleSave = async (data: Omit<Product, 'id'> & { id?: string }) => {
    if (!token || !id) return;
    const { data: updated, error } = await updateProduct(token, id, {
      judul: data.judul,
      deskripsi: data.deskripsi,
      harga: data.harga,
      foto: data.foto,
      kategori: data.kategori,
      badge: data.badge,
    });
    if (error) {
      toast.error('Gagal mengupdate produk', { description: error });
      return;
    }
    toast.success('Produk berhasil diupdate');
    if (updated) setProduct({ ...updated, id });
    router.push('/dashboard');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!token || !id) return;
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    const { error } = await deleteProduct(token, id);
    if (error) {
      toast.error('Gagal menghapus produk', { description: error });
      return;
    }
    toast.success('Produk berhasil dihapus');
    router.push('/dashboard');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Memuat...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-4">Produk tidak ditemukan.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
