# Jefri Digital Tools - Admin Dashboard Setup

**Stack:** Next.js (App Router) + Supabase (Auth, Database, Storage). Siap deploy ke Vercel.

Lihat **DEPLOY.md** untuk langkah deploy ke Vercel dan env Supabase.

## Quick Start Guide

### 1. Create Your First Admin Account

Since this is your first time using the dashboard, you'll need to create an admin account:

1. Open the application
2. Click on **"Daftar di sini"** (Register here) at the bottom of the login page
3. Fill in your details:
   - **Nama Lengkap**: Your full name
   - **Email**: Your email address (use any email format)
   - **Password**: At least 6 characters
   - **Konfirmasi Password**: Re-enter your password
4. Click **"Daftar"** (Register)
5. After successful registration, you'll be redirected to the login page
6. Login with your newly created credentials

### 2. Start Managing Products

Once logged in, you can:

- **View Products**: See all your digital products in a table
- **Add Product**: Click "Tambah Produk" to add a new product
- **Edit Product**: Click the edit icon on any product
- **Delete Product**: Click the delete icon to remove a product

### 3. Product Information

When adding or editing products, you'll need to provide:

- **Judul Produk**: Product title/name
- **Deskripsi**: Product description
- **Harga**: Price in Indonesian Rupiah (IDR)
- **Foto Produk**: Product image (upload from computer or paste image URL)
- **Kategori**: Category (Digital Tools, Template, Plugin, Software, E-book, Course)
- **Badge**: Optional badge (Terlaris, Baru, Diskon, Premium)

### 4. Features

✅ **Persistent Data**: All product data is stored in Supabase database
✅ **Image Storage**: Product images are stored securely in Supabase Storage
✅ **Authentication**: Secure login with Supabase Auth
✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
✅ **Real-time Updates**: Changes are immediately reflected

### 5. Security Notes

- Your session will persist across page refreshes
- Images are stored in private buckets with signed URLs
- All API calls are authenticated with your access token
- Click "Keluar" (Logout) when you're done to end your session

## Technical Details

### Backend (Next.js API Routes)
- **Server**: Next.js API Routes (deploy di Vercel)
- **Database**: Supabase table `kv_store_f7b45995`
- **Storage**: Supabase Storage bucket `make-f7b45995-products`
- **Auth**: Supabase Authentication

### Frontend
- **Framework**: Next.js 15 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI + custom components
- **Icons**: Lucide React

### API Endpoints (internal)
- `POST /api/auth/signup` - Create new admin user
- `GET /api/products` - Get all products (requires Bearer token)
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/[id]` - Update product (requires auth)
- `DELETE /api/products/[id]` - Delete product (requires auth)

## Troubleshooting

**Can't login after signup?**
- Make sure you're using the exact email and password you registered with
- Passwords are case-sensitive

**Images not showing?**
- The app uses signed URLs that expire after 1 hour
- Refresh the product list to get new signed URLs

**Lost your password?**
- Currently, password reset is not implemented
- You can create a new admin account with a different email

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Make sure you're connected to the internet
3. Try logging out and logging back in
4. Clear your browser cache and cookies

Enjoy managing your digital products! 🚀
