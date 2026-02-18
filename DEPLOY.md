# Deploy ke Vercel + Supabase

## 1. Siapkan Supabase

- Database Anda sudah ada di Supabase.
- Pastikan tabel **kv_store_f7b45995** ada (key TEXT PRIMARY KEY, value JSONB).
- Di Dashboard Supabase: **Storage** → buat bucket **make-f7b45995-products** (private).
- Di **Project Settings → API** catat:
  - **Project URL** → pakai untuk `https://mrifyzvxiqzghpeljomz.supabase.co`
  - **anon public** → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yaWZ5enZ4aXF6Z2hwZWxqb216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODMwNjcsImV4cCI6MjA4Njk1OTA2N30.jxsgyjwIUinjnR8kzThE-gwJ3TbiRTV52UxeJg-oTUM`
  - **service_role** (rahasia) → `sb_publishable_WZgOpLKsnE61Yy8E9b7vyQ_ixZBO1Eq` (hanya di server/Vercel)

## 2. Env lokal

Salin `.env.local.example` ke `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # dari API → service_role
```

## 3. Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 → Login / Daftar → Dashboard → Kelola produk.

## 4. Deploy ke Vercel

1. Push project ke GitHub (atau Git provider lain).
2. Di [Vercel](https://vercel.com): **Add New Project** → import repo ini.
3. **Environment Variables** (Settings → Environment Variables) tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Setelah selesai, website siap dipakai.

## Backend

- **Auth**: Supabase Auth (login/daftar).
- **Data**: Tabel `kv_store_f7b45995` (produk disimpan dengan key `product:<id>`).
- **Storage**: Bucket `make-f7b45995-products` untuk foto produk.
- **API**: Next.js API Routes (`/api/auth/signup`, `/api/products`, `/api/products/[id]`) yang memakai Supabase service role dan KV table.

Semua backend berjalan di Next.js (Vercel); tidak perlu Supabase Edge Functions terpisah.
