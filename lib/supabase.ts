import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type ProductCategory = 'maquillaje' | 'joyeria' | 'perfumes' | 'accesorios'
export type ProductBadge = 'Nuevo' | 'Oferta' | 'Bestseller' | 'Premium'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  image_url: string | null
  badge: ProductBadge | null
  stock: number
  created_at: string
  updated_at: string
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  category: ProductCategory
  image_url?: string
  badge?: ProductBadge
  stock?: number
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  category?: ProductCategory
  image_url?: string
  badge?: ProductBadge
  stock?: number
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
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: input.name,
        description: input.description || null,
        price: input.price,
        category: input.category,
        image_url: input.image_url || null,
        badge: input.badge || null,
        stock: input.stock ?? 0,
      })
      .select()
      .single()

    return { data, error }
  },

  // Update product
  async update(id: string, input: UpdateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .update(input)
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
