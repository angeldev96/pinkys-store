"use client";

import { useCallback, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Sube una imagen al bucket product-images y devuelve su URL pública.
 * Lo usan la portada, la galería y la foto de cada tono.
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return null;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('La imagen no puede ser mayor a 5MB');
      return null;
    }

    setError(null);
    setUploading(true);

    try {
      // createBrowserClient comparte la sesión (cookies) con el dashboard admin.
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error, setError };
}
