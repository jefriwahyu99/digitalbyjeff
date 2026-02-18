const API = '/api';

export interface Product {
  id: string;
  judul: string;
  deskripsi: string;
  harga: number;
  foto: string;
  kategori: string;
  badge?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<ApiResponse<unknown>> {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Signup failed' };
  return { data };
}

export async function getProducts(accessToken: string): Promise<ApiResponse<Product[]>> {
  const res = await fetch(`${API}/products`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Failed to fetch products' };
  return { data: data.products };
}

export async function createProduct(
  accessToken: string,
  productData: Omit<Product, 'id'>
): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Failed to create product' };
  return { data: data.product };
}

export async function updateProduct(
  accessToken: string,
  productId: string,
  productData: Omit<Product, 'id'>
): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API}/products/${productId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Failed to update product' };
  return { data: data.product };
}

export async function deleteProduct(
  accessToken: string,
  productId: string
): Promise<ApiResponse<void>> {
  const res = await fetch(`${API}/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || 'Failed to delete product' };
  return { data: undefined };
}
