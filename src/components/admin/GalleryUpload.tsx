"use client";

import { useRef } from 'react';
import { Images, Loader2, Plus, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

/**
 * Fotos sueltas del producto: la tabla de tonos, el empaque, la foto con
 * modelo. Las fotos de cada tono se cargan en el editor de tonos, no acá.
 */
export function GalleryUpload({ value, onChange }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useImageUpload();
  const images = value || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    // En serie: el hook expone un solo estado de carga y el orden de la
    // galería debe respetar el orden en que se eligieron las fotos.
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await upload(file);
      if (url) uploaded.push(url);
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded]);
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-pink-100 rounded-lg">
          <Images className="w-4 h-4 text-pink-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Más fotos</p>
          <p className="text-xs text-gray-500">
            Opcional: tabla de tonos, empaque, foto con modelo. Se ven en la galería del producto.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {images.map((url, index) => (
          <div
            key={url}
            className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white group"
          >
            <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              title="Quitar foto"
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white text-gray-400 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50/50 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium">Agregar</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
