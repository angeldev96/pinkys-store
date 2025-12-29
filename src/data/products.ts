import { productsApi, Product as SupabaseProduct, ProductCategory, ProductBadge } from '@/lib/supabase'

// Frontend-compatible product type
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  badge?: ProductBadge | null;
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
    price: Number(p.price),
    category: p.category,
    image: p.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: p.badge,
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
    price: Number(p.price),
    category: p.category,
    image: p.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: p.badge,
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
    price: Number(data.price),
    category: data.category,
    image: data.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    badge: data.badge,
  }
}
