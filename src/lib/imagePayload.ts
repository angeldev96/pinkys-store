/**
 * Prepares a captured photo for the vision API: downscales it and re-encodes as
 * JPEG so a 4–8MB phone photo travels as a few hundred KB of base64.
 */
export interface ImagePayload {
  image: string
  mediaType: string
}

const MAX_EDGE = 1024
const JPEG_QUALITY = 0.82

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
  }

  const dataUrl = await readAsDataUrl(file)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo leer la imagen'))
    img.src = dataUrl
  })
}

export async function fileToImagePayload(file: File): Promise<ImagePayload> {
  try {
    const bitmap = await loadBitmap(file)
    const { width, height } = bitmap
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height))

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas no disponible')

    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, canvas.width, canvas.height)
    if ('close' in bitmap) bitmap.close()

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    return { image: dataUrl.split(',')[1], mediaType: 'image/jpeg' }
  } catch {
    // Fallback: send the original bytes if canvas processing is unavailable.
    const dataUrl = await readAsDataUrl(file)
    const match = dataUrl.match(/^data:([^;]+);base64,([\s\S]*)$/)
    if (!match) throw new Error('No se pudo procesar la imagen')
    return { image: match[2], mediaType: match[1] }
  }
}
