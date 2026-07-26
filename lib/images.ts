// Fotos del producto: la portada (products.image_url), las fotos sueltas
// (products.images) y la foto de cada tono (variants[].image_url).

import { ProductVariant } from './variants'

/** Normaliza products.images, que llega como JSONB sin garantías de forma. */
export function parseImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  const urls: string[] = []

  for (const entry of value) {
    if (typeof entry !== 'string') continue
    const url = entry.trim()
    if (!url || seen.has(url)) continue
    seen.add(url)
    urls.push(url)
  }

  return urls
}

/**
 * Galería completa, en el orden en que se muestra: portada, fotos de los tonos
 * y al final las fotos sueltas (tabla de tonos, empaque, la modelo).
 */
export function productGallery(input: {
  image?: string | null
  images?: string[] | null
  variants?: ProductVariant[] | null
}): string[] {
  const candidates = [
    input.image,
    ...(input.variants || []).map((variant) => variant.image_url),
    ...(input.images || []),
  ]

  const seen = new Set<string>()
  const gallery: string[] = []

  for (const url of candidates) {
    if (!url || seen.has(url)) continue
    seen.add(url)
    gallery.push(url)
  }

  return gallery
}
