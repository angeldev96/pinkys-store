import { Plus, Palette } from 'lucide-react';
import { Product } from '@/data/products';
import { ProductVariant, availableVariants, hasVariants } from '@/lib/variants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant?: ProductVariant | null) => void;
  onView?: (product: Product) => void;
}

const badgeStyles: Record<string, string> = {
  'Nuevo': 'bg-blue-500 text-white',
  'Oferta': 'bg-orange-500 text-white',
  'Bestseller': 'bg-green-500 text-white',
  'Premium': 'bg-purple-500 text-white',
};

// Cuántos círculos de tono caben en la card antes de resumir con "+N".
const MAX_SWATCHES = 5;

const ProductCard = ({ product, onAddToCart, onView }: ProductCardProps) => {
  const handleCardClick = () => {
    if (onView) {
      onView(product);
    }
  };

  const withTones = hasVariants(product.variants);
  const tones = availableVariants(product.variants);
  const inStock = withTones ? tones.length > 0 : (product.stock ?? 0) > 0;
  const shownTones = tones.slice(0, MAX_SWATCHES);
  const hiddenTones = tones.length - shownTones.length;

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer fade-in"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${!inStock ? 'opacity-60 grayscale-[30%]' : ''}`}
          loading="lazy"
        />
        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full shadow-sm ${badgeStyles[product.badge] || 'bg-gray-500 text-white'}`}>
            {product.badge}
          </span>
        )}
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="block text-center bg-red-500/90 text-white text-[10px] sm:text-xs font-bold py-1 rounded-md">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Category & Gender */}
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium">
          {product.category} · {product.genero}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mt-1 line-clamp-2 min-h-[2.5em] transition-colors duration-200 group-hover:text-pink-600">
          {product.name}
        </h3>

        {/* Tonos disponibles (solo vista previa: el tono se elige en el detalle) */}
        {withTones && inStock && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {shownTones.map((tone) => (
                <span
                  key={tone.id}
                  title={tone.name}
                  className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center"
                >
                  {tone.image_url ? (
                    <img
                      src={tone.image_url}
                      alt={tone.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[8px] font-semibold text-gray-500 uppercase">
                      {tone.name.slice(0, 2)}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
              {hiddenTones > 0 ? `+${hiddenTones} ` : ''}
              {tones.length === 1 ? '1 tono' : `${tones.length} tonos`}
            </span>
          </div>
        )}

        {/* Price & Add Button */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-bold text-pink-600 transition-transform duration-200 group-hover:scale-105">
            L{product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!inStock) return;
              // Con tonos no se agrega a ciegas: se abre el detalle a elegir.
              if (withTones) {
                onView?.(product);
                return;
              }
              onAddToCart(product);
            }}
            disabled={!inStock}
            className={`p-2 rounded-lg transition-all duration-200 scale-on-active shrink-0 shadow-md ${
              inStock
                ? 'bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
            aria-label={
              !inStock
                ? `${product.name} agotado`
                : withTones
                  ? `Elegir tono de ${product.name}`
                  : `Agregar ${product.name} al carrito`
            }
          >
            {inStock && withTones ? <Palette className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
