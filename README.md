# Jefri Digital Tools – Admin Dashboard

Website admin untuk mengelola produk digital. **Next.js 15** + **Supabase** (auth, database, storage). Siap deploy ke Vercel.

---

## Struktur folder (file website yang dipakai)

Semua file di bawah ini adalah **file yang dipakai** untuk menjalankan website. Tidak ada lagi file lama Vite/React; yang lama sudah dihapus.

```
next-app/
├── app/                    ← Halaman & API (Next.js App Router)
│   ├── layout.tsx          ← Layout utama + Toaster
│   ├── page.tsx            ← Redirect ke /login
│   ├── globals.css         ← Style global (Tailwind)
│   ├── login/page.tsx      ← Halaman login
│   ├── signup/page.tsx     ← Halaman daftar
│   ├── dashboard/          ← Area admin (perlu login)
│   │   ├── layout.tsx      ← Layout dashboard + cek auth
│   │   ├── page.tsx        ← Daftar produk
│   │   ├── tambah/page.tsx ← Form tambah produk
│   │   └── produk/[id]/page.tsx  ← Form edit produk
│   └── api/                ← Backend (API routes)
│       ├── auth/signup/route.ts   ← Daftar admin
│       └── products/              ← CRUD produk
│           ├── route.ts           ← GET all, POST
│           └── [id]/route.ts       ← PUT, DELETE
│
├── components/             ← Komponen React
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── DashboardLayout.tsx
│   ├── ProductTable.tsx
│   ├── ProductForm.tsx
│   ├── LogoutButton.tsx
│   ├── AuthProvider.tsx
│   └── ui/                 ← Komponen UI (button, input, dll.)
│
├── lib/                    ← Kode pembantu
│   ├── supabase/client.ts  ← Supabase di browser
│   ├── supabase/server.ts  ← Supabase di server (API)
│   ├── kv.ts               ← Akses tabel KV di Supabase
│   ├── auth-client.ts      ← Login/logout/session
│   └── api-client.ts       ← Panggilan ke /api/*
│
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── .env.local              ← Env (URL + key Supabase)
├── .env.local.example
├── SETUP.md                ← Cara pakai & fitur
└── DEPLOY.md               ← Cara deploy ke Vercel
```

**File lain:** `ATTRIBUTIONS.md`, `guidelines/`, `next-env.d.ts` — boleh diabaikan atau dihapus kalau tidak dipakai.

---

## Menjalankan

1. Isi **SUPABASE_SERVICE_ROLE_KEY** di `.env.local` (dari Supabase Dashboard → API).
2. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Buka http://localhost:3000 → Daftar → Login → Dashboard.

Detail setup dan deploy ada di **SETUP.md** dan **DEPLOY.md**.
