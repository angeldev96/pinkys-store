import { ProductVariant } from '@/lib/variants';

interface VariantSwatchesProps {
  variants?: ProductVariant[] | null;
  /** Cuántas miniaturas se muestran antes de resumir con "+N". */
  max?: number;
}

/** Vista compacta de los tonos de un producto para las listas del admin. */
export function VariantSwatches({ variants, max = 5 }: VariantSwatchesProps) {
  const tones = variants || [];
  if (tones.length === 0) return null;

  const shown = tones.slice(0, max);
  const hidden = tones.length - shown.length;

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex -space-x-1.5">
        {shown.map((tone) => (
          <span
            key={tone.id}
            title={`${tone.name} · ${tone.stock} u.`}
            className={`w-6 h-6 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center ${tone.stock <= 0 ? 'opacity-40' : ''}`}
          >
            {tone.image_url ? (
              <img src={tone.image_url} alt={tone.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] font-semibold text-gray-500 uppercase">
                {tone.name.slice(0, 2)}
              </span>
            )}
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {hidden > 0 ? `+${hidden} ` : ''}
        {tones.length === 1 ? '1 tono' : `${tones.length} tonos`}
      </span>
    </div>
  );
}
