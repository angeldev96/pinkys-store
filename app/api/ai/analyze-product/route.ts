import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, ApiError, FinishReason, ThinkingLevel, type GenerateContentConfig } from '@google/genai'
import { createClient } from '@/lib/supabase-server'

// Vision analysis can take a few seconds; keep the route on the Node runtime.
export const runtime = 'nodejs'
export const maxDuration = 60

// Measured against real catalog photos: the flash-lite tier reads brand and
// shade off the packaging as accurately as the models 5x its price, and stays
// inside the "don't invent anything" rule that the bigger flash models broke.
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

const CATEGORIES = ['maquillaje', 'joyeria', 'perfumes', 'accesorios'] as const
const GENEROS = ['unisex', 'caballero', 'dama'] as const
const BADGES = ['Nuevo', 'Oferta', 'Bestseller', 'Premium', 'ninguno'] as const

const ALLOWED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
type MediaType = (typeof ALLOWED_MEDIA_TYPES)[number]

// Base64 inflates by ~4/3; cap the decoded image at ~4MB.
const MAX_BASE64_LENGTH = Math.ceil((4 * 1024 * 1024 * 4) / 3)

const SYSTEM_PROMPT = `Eres el asistente de catálogo de una tienda en línea de Honduras que vende por WhatsApp e Instagram (maquillaje, perfumes, joyería y accesorios, y ocasionalmente otros productos de consumo).

A partir de UNA foto del producto, escribes la ficha lista para publicar. Reglas:

- Escribe en español de Honduras: cercano, claro y directo, sin regionalismos de otros países y sin caer en exageraciones publicitarias.
- Nombre: 3 a 8 palabras. Incluye marca y variante SOLO si se leen con claridad en la foto (etiqueta, empaque, grabado). Si no se leen, describe el producto genéricamente ("Labial líquido mate tono nude"). Nunca inventes marcas ni modelos.
- Descripción: 2 a 4 oraciones (máximo ~350 caracteres). Describe lo que realmente se ve —tipo de producto, color, acabado, material aparente, tamaño relativo, presentación— y para qué o para quién sirve. Cierra con una razón concreta de compra.
- No inventes datos que la foto no muestra: precio, ingredientes, quilates, mililitros exactos, garantías, origen, disponibilidad o promociones. Si un dato es dudoso, omítelo.
- No uses emojis, hashtags, ni signos de exclamación en cadena. No menciones la foto, el fondo ni la iluminación.
- Categoría: elige la más cercana entre las opciones disponibles aunque el producto no encaje perfecto.
- Género: "dama", "caballero" o "unisex" según a quién se dirige típicamente el producto; ante la duda usa "unisex".
- Badge: usa "ninguno" salvo que la foto justifique claramente otra etiqueta (por ejemplo, empaque de edición premium).
- Si la foto no permite identificar un producto vendible (está borrosa, vacía o no es un producto), pon detected en false, deja name y description vacíos y explica brevemente en notes qué falta.`

// Plain JSON Schema — passed via responseJsonSchema, which Gemini honors as a
// hard constraint on the output (responseMimeType must be application/json).
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    detected: {
      type: 'boolean',
      description: 'true si la foto muestra un producto identificable y vendible',
    },
    name: {
      type: 'string',
      description: 'Nombre comercial del producto, 3 a 8 palabras. Vacío si detected es false.',
    },
    description: {
      type: 'string',
      description: 'Descripción de venta de 2 a 4 oraciones. Vacía si detected es false.',
    },
    category: { type: 'string', enum: [...CATEGORIES] },
    genero: { type: 'string', enum: [...GENEROS] },
    badge: { type: 'string', enum: [...BADGES] },
    notes: {
      type: 'string',
      description: 'Aclaración breve para el vendedor: dudas, datos que faltan o por qué no se detectó.',
    },
  },
  required: ['detected', 'name', 'description', 'category', 'genero', 'badge', 'notes'],
  propertyOrdering: ['detected', 'name', 'description', 'category', 'genero', 'badge', 'notes'],
}

interface AnalyzeRequestBody {
  image?: string
  mediaType?: string
}

function parseImagePayload(body: AnalyzeRequestBody): { data: string; mediaType: MediaType } | { error: string } {
  const raw = body.image
  if (typeof raw !== 'string' || raw.length === 0) {
    return { error: 'Falta la imagen' }
  }

  let data = raw
  let mediaType = body.mediaType

  // Accept both a bare base64 string and a full data URL.
  const dataUrlMatch = raw.match(/^data:([a-z/+.-]+);base64,([\s\S]*)$/i)
  if (dataUrlMatch) {
    mediaType = dataUrlMatch[1].toLowerCase()
    data = dataUrlMatch[2]
  }

  if (!mediaType || !ALLOWED_MEDIA_TYPES.includes(mediaType as MediaType)) {
    return { error: 'Formato de imagen no soportado (usa JPG, PNG, WebP o GIF)' }
  }

  data = data.replace(/\s/g, '')
  if (data.length === 0) {
    return { error: 'Falta la imagen' }
  }
  if (data.length > MAX_BASE64_LENGTH) {
    return { error: 'La imagen es demasiado grande' }
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
    return { error: 'La imagen no está codificada correctamente' }
  }

  return { data, mediaType: mediaType as MediaType }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'El asistente de IA no está configurado (falta GEMINI_API_KEY)' },
      { status: 503 }
    )
  }

  // Same guard the admin dashboard uses: authenticated user with the admin role.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  let body: AnalyzeRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const payload = parseImagePayload(body)
  if ('error' in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 })
  }

  const ai = new GoogleGenAI({ apiKey })

  const contents = [
    {
      role: 'user',
      parts: [
        { inlineData: { mimeType: payload.mediaType, data: payload.data } },
        { text: 'Genera la ficha de este producto para el catálogo de la tienda.' },
      ],
    },
  ]

  const baseConfig: GenerateContentConfig = {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: 'application/json',
    responseJsonSchema: OUTPUT_SCHEMA,
    maxOutputTokens: 1024,
  }

  try {
    let response
    try {
      response = await ai.models.generateContent({
        model: MODEL,
        contents,
        // Reading one product photo needs no reasoning, and the low level
        // measured 0 thinking tokens. Gemini 2.x models reject thinkingLevel
        // (they use thinkingBudget), so a GEMINI_MODEL override falls back below.
        config: { ...baseConfig, thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      })
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 400) throw error
      response = await ai.models.generateContent({ model: MODEL, contents, config: baseConfig })
    }

    const finishReason = response.candidates?.[0]?.finishReason
    if (finishReason === FinishReason.SAFETY || finishReason === FinishReason.PROHIBITED_CONTENT) {
      return NextResponse.json(
        { error: 'El asistente no pudo analizar esta imagen' },
        { status: 422 }
      )
    }
    if (finishReason === FinishReason.MAX_TOKENS) {
      return NextResponse.json(
        { error: 'La respuesta del asistente quedó incompleta, intenta de nuevo' },
        { status: 502 }
      )
    }

    const text = response.text
    if (!text) {
      return NextResponse.json({ error: 'El asistente no devolvió resultados' }, { status: 502 })
    }

    const result = JSON.parse(text)

    return NextResponse.json({
      detected: Boolean(result.detected),
      name: typeof result.name === 'string' ? result.name.trim() : '',
      description: typeof result.description === 'string' ? result.description.trim() : '',
      category: CATEGORIES.includes(result.category) ? result.category : 'accesorios',
      genero: GENEROS.includes(result.genero) ? result.genero : 'unisex',
      badge: result.badge && result.badge !== 'ninguno' ? result.badge : null,
      notes: typeof result.notes === 'string' ? result.notes.trim() : '',
    })
  } catch (error) {
    console.error('AI product analysis failed:', error)

    if (error instanceof ApiError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Demasiadas solicitudes al asistente, intenta en unos segundos' },
          { status: 429 }
        )
      }
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json({ error: 'La clave de API de IA no es válida' }, { status: 503 })
      }
    }

    return NextResponse.json({ error: 'No se pudo analizar la imagen' }, { status: 502 })
  }
}
