import { ProductVariant } from '@/lib/variants';

interface VariantSwatchesProps {
  variants?: ProductVariant[] | null;
  /** Cuántos círculos se muestran antes de resumir con "+N". */
  max?: number;
}

/** Vista compacta de los tonos de un producto para las listas del admin. */
export function VariantSwatches({ variants, max = 6 }: VariantSwatchesProps) {
  const tones = variants || [];
  if (tones.length === 0) return null;

  const shown = tones.slice(0, max);
  const hidden = tones.length - shown.length;

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex -space-x-1">
        {shown.map((tone) => (
          <span
            key={tone.id}
            title={`${tone.name} · ${tone.stock} u.`}
            className={`w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm ${tone.stock <= 0 ? 'opacity-40' : ''}`}
            style={{ backgroundColor: tone.hex || '#e5e7eb' }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {hidden > 0 ? `+${hidden} ` : ''}
        {tones.length === 1 ? '1 tono' : `${tones.length} tonos`}
      </span>
    </div>
  );
}
