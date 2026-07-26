"use client";

import { useRef } from 'react';
import { ImagePlus, Loader2, RefreshCw, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface VariantImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Nombre del tono, para el alt y el aria-label. */
  label?: string;
}

/**
 * Foto del tono: es su swatch en la tienda y la imagen que se muestra al
 * elegirlo. Con foto cargada, tocar la miniatura la reemplaza.
 */
export function VariantImageUpload({ value, onChange, label }: VariantImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useImageUpload();
  const toneName = label?.trim() || 'este tono';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const url = await upload(file);
    if (url) onChange(url);
  };

  return (
    <div className="shrink-0 w-20">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden group">
        {value ? (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              title="Cambiar foto"
              aria-label={`Cambiar la foto de ${toneName}`}
              className="w-full h-full border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <img src={value} alt={label || 'Tono'} className="w-full h-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/55 text-white text-[10px] font-medium py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <RefreshCw className="w-3 h-3" />
                Cambiar
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              title="Quitar foto"
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label={`Subir la foto de ${toneName}`}
            className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-pink-300 bg-white text-pink-600 hover:bg-pink-50 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px] font-semibold leading-none">Foto</span>
              </>
            )}
          </button>
        )}

        {value && uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-[10px] text-red-600 mt-1">{error}</p>}
    </div>
  );
}
