import { createClient } from '@supabase/supabase-js'
import { ProductVariant, parseVariants, variantsTotalStock } from './variants'
import { parseImageUrls } from './images'

export type { ProductVariant }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type ProductCategory = 'maquillaje' | 'joyeria' | 'perfumes' | 'accesorios'
export type ProductGender = 'unisex' | 'caballero' | 'dama'
export type ProductBadge = 'Nuevo' | 'Oferta' | 'Bestseller' | 'Premium'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  genero: ProductGender
  image_url: string | null
  badge: ProductBadge | null
  stock: number
  /** Tonos del producto. Vacío = producto sin tonos. */
  variants: ProductVariant[]
  /** Fotos extra, aparte de image_url y de la foto de cada tono. */
  images: string[]
  created_at: string
  updated_at: string
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  category: ProductCategory
  genero?: ProductGender
  image_url?: string
  badge?: ProductBadge
  stock?: number
  variants?: ProductVariant[]
  images?: string[]
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  category?: ProductCategory
  genero?: ProductGender
  image_url?: string
  badge?: ProductBadge
  stock?: number
  variants?: ProductVariant[]
  images?: string[]
}

/**
 * Deja la fila lista para escribir: tonos normalizados y, si el producto maneja
 * tonos, el stock del producto pasa a ser la suma de ellos.
 */
function withVariantStock<T extends { stock?: number; variants?: unknown }>(input: T) {
  const variants = parseVariants(input.variants)
  return {
    variants,
    stock: variants.length > 0 ? variantsTotalStock(variants) : input.stock,
  }
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateOrderInput {
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total: number
  notes?: string
}

// Storage helpers
export const storageApi = {
  async uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  },

  async deleteProductImage(url: string): Promise<{ error: string | null }> {
    // Extract file path from public URL
    const path = url.split('/product-images/')[1]
    if (!path) return { error: 'Invalid URL' }

    const { error } = await supabase.storage
      .from('product-images')
      .remove([path])

    return { error: error?.message || null }
  },
}

// Products API
export const productsApi = {
  // Get all products
  async getAll(category?: ProductCategory) {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Get product by ID
  async getById(id: string) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    return { data, error }
  },

  // Create product
  async create(input: CreateProductInput) {
    const normalized = withVariantStock(input)

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: input.name,
        description: input.description || null,
        price: input.price,
        category: input.category,
        genero: input.genero || 'unisex',
        image_url: input.image_url || null,
        badge: input.badge || null,
        stock: normalized.stock ?? 0,
        variants: normalized.variants,
        images: parseImageUrls(input.images),
      })
      .select()
      .single()

    return { data, error }
  },

  // Update product
  async update(id: string, input: UpdateProductInput) {
    // Solo se toca `variants`/`stock` si el caller los mandó; un update parcial
    // de, por ejemplo, el precio no debe borrar los tonos.
    const patch: Record<string, unknown> = { ...input }
    if (input.variants !== undefined) {
      Object.assign(patch, withVariantStock(input))
    }
    if (input.images !== undefined) {
      patch.images = parseImageUrls(input.images)
    }

    const { data, error } = await supabase
      .from('products')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  // Delete product
  async delete(id: string) {
    const { data, error } = await supabase.from('products').delete().eq('id', id)
    return { data, error }
  },

  // Search products
  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name', { ascending: true })

    return { data, error }
  },
}

// Orders API
export const ordersApi = {
  async getAll(status?: OrderStatus) {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (status) {
      query = query.eq('status', status)
    }
    const { data, error } = await query
    return { data, error }
  },

  async create(input: CreateOrderInput) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        items: input.items,
        total: input.total,
        notes: input.notes || null,
      })
      .select()
      .single()
    return { data, error }
  },

  async updateStatus(id: string, status: OrderStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
}
