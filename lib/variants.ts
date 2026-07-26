// Tonos / variantes de producto. Viven como JSONB en products.variants, así que
// todo lo que entra desde la base pasa por parseVariants antes de usarse.

export interface ProductVariant {
  id: string
  name: string
  /** Foto de ESTE tono. Es el swatch del catálogo y la imagen que se muestra al elegirlo. */
  image_url: string | null
  stock: number
}

export function makeVariantId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `v-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

function parseVariant(value: unknown): ProductVariant | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>

  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!name) return null

  const imageUrl = typeof raw.image_url === 'string' && raw.image_url.trim()
    ? raw.image_url.trim()
    : null

  const stock = Number(raw.stock)

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : makeVariantId(),
    name,
    image_url: imageUrl,
    stock: Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : 0,
  }
}

/** Normaliza lo que venga de la base (o de un carrito guardado) a tonos válidos. */
export function parseVariants(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const variants: ProductVariant[] = []

  for (const entry of value) {
    const variant = parseVariant(entry)
    if (!variant || seen.has(variant.id)) continue
    seen.add(variant.id)
    variants.push(variant)
  }

  return variants
}

export function hasVariants(variants?: ProductVariant[] | null): boolean {
  return Array.isArray(variants) && variants.length > 0
}

/** Stock del producto cuando maneja tonos: la suma de todos ellos. */
export function variantsTotalStock(variants?: ProductVariant[] | null): number {
  if (!Array.isArray(variants)) return 0
  return variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
}

export function availableVariants(variants?: ProductVariant[] | null): ProductVariant[] {
  return (variants || []).filter((variant) => variant.stock > 0)
}

/**
 * Clave de línea del carrito. Dos tonos del mismo producto son dos líneas
 * distintas, por eso el carrito no puede seguir usando solo el id del producto.
 */
export function cartLineId(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}::${variantId}` : productId
}
