'use client';

import Link from 'next/link';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/api-client';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">
          Total: <span className="font-semibold text-slate-900">{products.length}</span> produk
        </p>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30">
          <Link href="/dashboard/tambah">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada produk</h3>
            <p className="text-slate-600 mb-6">Mulai tambahkan produk pertama Anda</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Link href="/dashboard/tambah">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Foto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Judul</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Kategori</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Harga</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index === products.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.foto}
                          alt={product.judul}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-slate-900">{product.judul}</p>
                          <p className="text-sm text-slate-600 line-clamp-1">{product.deskripsi}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700">
                          {product.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">{formatPrice(product.harga)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {product.badge && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            {product.badge}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href={`/dashboard/produk/${product.id}`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-200">
              {products.map((product) => (
                <div key={product.id} className="p-4 space-y-3">
                  <div className="flex gap-4">
                    <img
                      src={product.foto}
                      alt={product.judul}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{product.judul}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mt-1">{product.deskripsi}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {product.kategori}
                        </span>
                        {product.badge && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-slate-900">{formatPrice(product.harga)}</span>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Link href={`/dashboard/produk/${product.id}`}>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
