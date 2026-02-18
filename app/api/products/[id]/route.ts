import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { kvGet, kvSet, kvDel } from '@/lib/kv';

const BUCKET_NAME = 'make-f7b45995-products';

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
  return { supabase };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { supabase } = authResult;

  const { id: productId } = await params;
  const key = `product:${productId}`;

  try {
    const existingProduct = await kvGet(key);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productData = await request.json();
    let imageKey: string | null = (existingProduct.imageKey as string) ?? null;

    if (productData.foto?.startsWith('data:')) {
      if (imageKey) {
        await supabase.storage.from(BUCKET_NAME).remove([imageKey]);
      }
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

    const updatedProduct = {
      judul: productData.judul,
      deskripsi: productData.deskripsi,
      harga: productData.harga,
      foto: imageKey ? '' : (productData.foto ?? ''),
      imageKey,
      kategori: productData.kategori,
      badge: productData.badge ?? null,
      updatedAt: new Date().toISOString(),
      createdAt: existingProduct.createdAt,
    };

    await kvSet(key, updatedProduct);

    let signedUrl = updatedProduct.foto;
    if (imageKey) {
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(imageKey, 3600);
      signedUrl = data?.signedUrl ?? '';
    }

    return NextResponse.json({
      product: {
        id: productId,
        ...updatedProduct,
        foto: signedUrl,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(_request);
  if (authResult instanceof NextResponse) return authResult;
  const { supabase } = authResult;

  const { id: productId } = await params;
  const key = `product:${productId}`;

  try {
    const existingProduct = await kvGet(key);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.imageKey) {
      await supabase.storage.from(BUCKET_NAME).remove([existingProduct.imageKey as string]);
    }

    await kvDel(key);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
