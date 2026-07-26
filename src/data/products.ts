import { productsApi, Product as SupabaseProduct, ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase'
import { ProductVariant, parseVariants } from '@/lib/variants'
import { parseImageUrls } from '@/lib/images'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'

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
  /** Tonos del producto. Vacío = producto sin tonos. */
  variants: ProductVariant[];
  /** Fotos extra, aparte de la portada y de la foto de cada tono. */
  images: string[];
}

export type CartItem = Product & {
  quantity: number;
  /** Clave de la línea del carrito: dos tonos del mismo producto son dos líneas. */
  lineId: string;
  /** Tono elegido, o null si el producto no maneja tonos. */
  variant: ProductVariant | null;
};

function toProduct(row: SupabaseProduct): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    genero: row.genero,
    image: row.image_url || FALLBACK_IMAGE,
    badge: row.badge,
    stock: row.stock,
    variants: parseVariants(row.variants),
    images: parseImageUrls(row.images),
  }
}

// Fetch products from Supabase
export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const { data, error } = await productsApi.getAll(category)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []).map(toProduct)
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await productsApi.search(query)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return (data || []).map(toProduct)
}

// Get single product
export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await productsApi.getById(id)

  if (error || !data) {
    console.error('Error fetching product:', error)
    return null
  }

  return toProduct(data)
}
