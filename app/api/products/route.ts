import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { kvGetByPrefix, kvSet } from '@/lib/kv';

const BUCKET_NAME = 'make-f7b45995-products';

async function ensureBucket(supabase: ReturnType<typeof createServerSupabase>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
  }
}

function getAuthToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

async function verifyAuth(request: Request) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing Authorization header' },
      { status: 401 }
    );
  }
  const supabase = createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    );
  }
  return { token, user, supabase };
}

export async function GET(request: Request) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { supabase } = authResult;

  try {
    await ensureBucket(supabase);
    const rows = await kvGetByPrefix('product:');

    const productsWithUrls = await Promise.all(
      rows.map(async ({ key, value }) => {
        const id = key.replace('product:', '');
        const val = value as {
          imageKey?: string;
          judul: string;
          deskripsi: string;
          harga: number;
          foto: string;
          kategori: string;
          badge?: string;
        };
        let foto = val.foto;
        if (val.imageKey) {
          const { data } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(val.imageKey, 3600);
          foto = data?.signedUrl ?? val.foto;
        }
        return {
          id,
          judul: val.judul,
          deskripsi: val.deskripsi,
          harga: val.harga,
          foto,
          kategori: val.kategori,
          badge: val.badge ?? undefined,
        };
      })
    );

    return NextResponse.json({ products: productsWithUrls });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { supabase } = authResult;

  try {
    await ensureBucket(supabase);
    const productData = await request.json();
    const productId = Date.now().toString();

    let imageKey: string | null = null;
    if (productData.foto?.startsWith('data:')) {
      const base64Data = productData.foto.split(',')[1];
      const extension = productData.foto.split(';')[0].split('/')[1];
      imageKey = `${productId}.${extension}`;
      const buffer = Buffer.from(base64Data, 'base64');
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(imageKey, buffer, {
          contentType: `image/${extension}`,
          upsert: true,
        });
      if (uploadError) {
        return NextResponse.json(
          { error: `Image upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }

    const product = {
      judul: productData.judul,
      deskripsi: productData.deskripsi,
      harga: productData.harga,
      foto: imageKey ? '' : (productData.foto ?? ''),
      imageKey,
      kategori: productData.kategori,
      badge: productData.badge ?? null,
      createdAt: new Date().toISOString(),
    };

    await kvSet(`product:${productId}`, product);

    let signedUrl = product.foto;
    if (imageKey) {
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(imageKey, 3600);
      signedUrl = data?.signedUrl ?? '';
    }

    return NextResponse.json({
      product: {
        id: productId,
        ...product,
        foto: signedUrl,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
