"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Camera, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (uploading: boolean) => void;
  /** Called with the selected file so the parent can run the AI analysis. */
  onFilePicked?: (file: File) => void;
  /** Shows the AI progress state on the preview. */
  analyzing?: boolean;
}

export function ImageUpload({ value, onChange, onUploading, onFilePicked, analyzing }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede ser mayor a 5MB');
      return;
    }

    setError(null);
    setLastFile(file);
    // Kick off the AI analysis in parallel with the upload.
    onFilePicked?.(file);
    setUploading(true);
    onUploading?.(true);

    try {
      // Use createBrowserClient so it shares the auth session (cookies) with the admin dashboard
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        onChange(publicUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
      onUploading?.(false);
    }
  }, [onChange, onUploading, onFilePicked]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleRemove = () => {
    onChange('');
    setLastFile(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Imagen del Producto
      </label>

      {value ? (
        <div className="space-y-2">
          <div className="relative group">
            <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
              <img
                src={value}
                alt="Producto"
                className="w-full h-full object-cover"
              />
              {analyzing && (
                <div className="absolute inset-0 bg-pink-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-xs font-medium">Analizando...</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {onFilePicked && lastFile && !analyzing && (
            <button
              type="button"
              onClick={() => onFilePicked(lastFile)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 transition"
            >
              <Sparkles className="w-4 h-4" />
              Volver a completar con IA
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-300 bg-gray-50 hover:border-pink-400 hover:bg-pink-50/50'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 p-4">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Upload className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {dragActive ? 'Suelta la imagen aquí' : 'Subir imagen'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP o GIF (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium rounded-xl shadow-sm shadow-pink-600/30 transition touch-target"
          >
            <Camera className="w-5 h-5" />
            Tomar foto del producto
          </button>
          {onFilePicked && (
            <p className="text-xs text-gray-500 text-center">
              La IA completa el nombre y la descripción por vos.
            </p>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
