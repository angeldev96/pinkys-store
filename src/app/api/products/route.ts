import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/data/products'
import { ProductCategory } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') as ProductCategory | null
  const query = searchParams.get('q')

  try {
    if (query) {
      const products = await searchProducts(query)
      return NextResponse.json(products)
    }

    const products = await getProducts(category || undefined)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
