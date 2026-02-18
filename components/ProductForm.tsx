'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/lib/api-client';

interface ProductFormProps {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id'> & { id?: string }) => Promise<void>;
  onDelete?: () => void;
  mode: 'add' | 'edit';
}

export function ProductForm({ product, onSave, onDelete, mode }: ProductFormProps) {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    harga: '',
    foto: '',
    kategori: '',
    badge: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        judul: product.judul,
        deskripsi: product.deskripsi,
        harga: product.harga.toString(),
        foto: product.foto,
        kategori: product.kategori,
        badge: product.badge || '',
      });
      setPreviewImage(product.foto);
    }
  }, [product]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prev) => ({ ...prev, foto: result }));
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, foto: url }));
    setPreviewImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const productData = {
      ...(product?.id && { id: product.id }),
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      harga: parseFloat(formData.harga),
      foto: formData.foto,
      kategori: formData.kategori,
      badge: formData.badge || undefined,
    };
    await onSave(productData);
    setSaving(false);
  };

  const categories = ['Digital Tools', 'Template', 'Plugin', 'Software', 'E-book', 'Course'];
  const badges = ['', 'Terlaris', 'Baru', 'Diskon', 'Premium'];

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="judul" className="text-slate-700">Judul Produk <span className="text-red-500">*</span></Label>
            <Input
              id="judul"
              value={formData.judul}
              onChange={(e) => setFormData((prev) => ({ ...prev, judul: e.target.value }))}
              placeholder="Masukkan judul produk"
              required
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-slate-700">Deskripsi <span className="text-red-500">*</span></Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))}
              placeholder="Deskripsikan produk Anda"
              required
              rows={4}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harga" className="text-slate-700">Harga (IDR) <span className="text-red-500">*</span></Label>
            <Input
              id="harga"
              type="number"
              value={formData.harga}
              onChange={(e) => setFormData((prev) => ({ ...prev, harga: e.target.value }))}
              placeholder="0"
              required
              min={0}
              step={1000}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Foto Produk <span className="text-red-500">*</span></Label>
            <div className="space-y-4">
              {previewImage ? (
                <div className="relative w-full h-48 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage('');
                      setFormData((prev) => ({ ...prev, foto: '' }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">Belum ada foto</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-300"
                  >
                    <Upload className="w-4 h-4" />
                    Upload dari Komputer
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <Input
                  type="url"
                  value={formData.foto.startsWith('data:') ? '' : formData.foto}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Atau paste URL gambar"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori" className="text-slate-700">Kategori <span className="text-red-500">*</span></Label>
            <Select
              value={formData.kategori}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, kategori: value }))}
              required
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge" className="text-slate-700">Badge (Opsional)</Label>
            <Select
              value={formData.badge}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, badge: value }))}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Pilih badge" />
              </SelectTrigger>
              <SelectContent>
                {badges.map((badge) => (
                  <SelectItem key={badge || 'none'} value={badge}>
                    {badge || 'Tidak ada'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            {mode === 'edit' ? (
              <>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Update Produk'}
                </Button>
                <Button type="button" variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                  <Link href="/dashboard">
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Link>
                </Button>
                {onDelete && (
                  <Button type="button" onClick={onDelete} variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Produk
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
                <Button type="button" variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                  <Link href="/dashboard">
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Link>
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
