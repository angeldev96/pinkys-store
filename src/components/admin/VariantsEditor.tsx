"use client";

import { Palette, Plus, Trash2 } from 'lucide-react';
import { ProductVariant, makeVariantId, variantsTotalStock } from '@/lib/variants';

interface VariantsEditorProps {
  value: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

const DEFAULT_SWATCH = '#e5e7eb';

const inputClass =
  'w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch';

export function VariantsEditor({ value, onChange }: VariantsEditorProps) {
  const variants = value || [];
  const enabled = variants.length > 0;

  const addVariant = () => {
    onChange([...variants, { id: makeVariantId(), name: '', hex: null, stock: 0 }]);
  };

  const updateVariant = (id: string, patch: Partial<ProductVariant>) => {
    onChange(variants.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((variant) => variant.id !== id));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-100 rounded-lg">
            <Palette className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Tonos</p>
            <p className="text-xs text-gray-500">
              Para el mismo producto en varias tonalidades. Dejalo vacío si no aplica.
            </p>
          </div>
        </div>

        {enabled && (
          <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full">
            {variants.length} {variants.length === 1 ? 'tono' : 'tonos'} · {variantsTotalStock(variants)} u.
          </span>
        )}
      </div>

      {enabled && (
        <div className="mt-4 space-y-2">
          <div className="hidden sm:grid sm:grid-cols-[auto_1fr_7rem_auto] gap-2 px-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            <span className="w-10">Color</span>
            <span>Nombre del tono</span>
            <span>Stock</span>
            <span className="w-9" />
          </div>

          {variants.map((variant) => (
            <div
              key={variant.id}
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_7rem_auto] gap-2 items-center"
            >
              {/* Swatch: input color nativo dentro de un círculo */}
              <label
                className="relative w-10 h-10 rounded-full ring-1 ring-black/10 shadow-sm cursor-pointer shrink-0 overflow-hidden"
                style={{ backgroundColor: variant.hex || DEFAULT_SWATCH }}
                title={variant.hex ? `Color ${variant.hex}` : 'Elegir color'}
              >
                <input
                  type="color"
                  value={variant.hex || DEFAULT_SWATCH}
                  onChange={(e) => updateVariant(variant.id, { hex: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label={`Color del tono ${variant.name || 'sin nombre'}`}
                />
              </label>

              <input
                type="text"
                required
                placeholder="Ej. Rosa Nude"
                value={variant.name}
                onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                className={inputClass}
              />

              <input
                type="number"
                min={0}
                required
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  updateVariant(variant.id, { stock: parseInt(e.target.value, 10) || 0 })
                }
                className={`${inputClass} col-start-2 sm:col-start-auto`}
              />

              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                title="Quitar tono"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addVariant}
        className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-pink-700 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition touch-target"
      >
        <Plus className="w-4 h-4" />
        {enabled ? 'Agregar otro tono' : 'Este producto tiene tonos'}
      </button>

      {enabled && (
        <p className="text-xs text-gray-500 mt-3">
          El stock del producto pasa a ser la suma de los tonos.
        </p>
      )}
    </div>
  );
}
