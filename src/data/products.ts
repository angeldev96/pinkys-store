import { productsApi, Product as SupabaseProduct, ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase'

// Frontend-compatible product type
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: ProductCategory;
  genero: ProductGender;
  image: string;
  badge?: ProductBadge | null;
  stock?: number;
}

export type CartItem = Product & { quantity: number };

// Fetch products from Supabase
export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const { data, error } = await productsApi.getAll(category)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    genero: p.genero,
    image: p.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: p.badge,
    stock: p.stock,
  }))
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await productsApi.search(query)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    genero: p.genero,
    image: p.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: p.badge,
    stock: p.stock,
  }))
}

// Get single product
export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await productsApi.getById(id)

  if (error || !data) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    genero: data.genero,
    image: data.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: data.badge,
    stock: data.stock,
  }
}
