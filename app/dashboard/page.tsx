'use client';

import { useEffect, useState } from 'react';
import { getSession } from '@/lib/auth-client';
import { getProducts, deleteProduct, type Product } from '@/lib/api-client';
import { ProductTable } from '@/components/ProductTable';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getSession().then(({ accessToken }) => {
      if (accessToken) {
        setToken(accessToken);
      }
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getProducts(token).then(({ data, error }) => {
      if (error) toast.error('Gagal memuat produk', { description: error });
      else if (data) setProducts(data);
      setLoading(false);
    });
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    if (!token) return;
    const { error } = await deleteProduct(token, id);
    if (error) toast.error('Gagal menghapus produk', { description: error });
    else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produk berhasil dihapus');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Memuat produk...</p>
      </div>
    );
  }

  return <ProductTable products={products} onDelete={handleDelete} />;
}
