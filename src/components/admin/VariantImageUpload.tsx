"use client";

import { useRef } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface VariantImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Nombre del tono, para el alt y el aria-label. */
  label?: string;
}

/** Miniatura cuadrada: la foto del tono, que también es su swatch en la tienda. */
export function VariantImageUpload({ value, onChange, label }: VariantImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const url = await upload(file);
    if (url) onChange(url);
  };

  return (
    <div className="shrink-0">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-white group">
        {value ? (
          <>
            <img src={value} alt={label || 'Tono'} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              title="Quitar foto"
              className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label={`Subir foto del tono ${label || ''}`.trim()}
            className="w-full h-full flex items-center justify-center bg-gray-50 hover:bg-pink-50 hover:text-pink-600 text-gray-400 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
            ) : (
              <ImagePlus className="w-5 h-5" />
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

      {error && <p className="text-[10px] text-red-600 mt-1 max-w-14">{error}</p>}
    </div>
  );
}
