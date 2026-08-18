import type {
  Product as SupabaseProduct,
  ProductCategory,
  ProductGender,
  ProductBadge,
} from '@/lib/supabase'

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

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'

// The storefront only ever reads products, so it talks to PostgREST directly
// instead of pulling the whole supabase-js client (auth + realtime + storage)
// into the public bundle.
const REST_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const COLUMNS = 'id,name,description,price,category,genero,image_url,badge,stock'

type ProductRow = Pick<
  SupabaseProduct,
  'id' | 'name' | 'description' | 'price' | 'category' | 'genero' | 'image_url' | 'badge' | 'stock'
>

async function queryProducts(params: URLSearchParams): Promise<ProductRow[]> {
  params.set('select', COLUMNS)

  const response = await fetch(`${REST_URL}?${params.toString()}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase REST ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    genero: row.genero,
    image: row.image_url || PLACEHOLDER_IMAGE,
    badge: row.badge,
    stock: row.stock,
  }
}

// Fetch products
export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const params = new URLSearchParams({ order: 'created_at.desc' })
  if (category) {
    params.set('category', `eq.${category}`)
  }

  try {
    return (await queryProducts(params)).map(toProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const params = new URLSearchParams({
    or: `(name.ilike.*${query}*,description.ilike.*${query}*)`,
    order: 'name.asc',
  })

  try {
    return (await queryProducts(params)).map(toProduct)
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// Get single product
export async function getProduct(id: string): Promise<Product | null> {
  const params = new URLSearchParams({ id: `eq.${id}`, limit: '1' })

  try {
    const [row] = await queryProducts(params)
    return row ? toProduct(row) : null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
