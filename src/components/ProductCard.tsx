import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView?: (product: Product) => void;
}

// Shades chosen so white text keeps a >= 4.5:1 contrast ratio (WCAG AA).
export const badgeStyles: Record<string, string> = {
  'Nuevo': 'bg-blue-700 text-white',
  'Oferta': 'bg-orange-700 text-white',
  'Bestseller': 'bg-green-700 text-white',
  'Premium': 'bg-purple-700 text-white',
};

const ProductCard = ({ product, onAddToCart, onView }: ProductCardProps) => {
  const handleCardClick = () => {
    if (onView) {
      onView(product);
    }
  };

  const inStock = (product.stock ?? 0) > 0;

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer fade-in"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={65}
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${!inStock ? 'opacity-60 grayscale-[30%]' : ''}`}
        />
        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full shadow-sm ${badgeStyles[product.badge] || 'bg-gray-600 text-white'}`}>
            {product.badge}
          </span>
        )}
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="block text-center bg-red-700/95 text-white text-[10px] sm:text-xs font-bold py-1 rounded-md">
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

        {/* Price & Add Button */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-bold text-pink-600 transition-transform duration-200 group-hover:scale-105">
            L{product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (inStock) onAddToCart(product);
            }}
            disabled={!inStock}
            className={`p-2 rounded-lg transition-all duration-200 scale-on-active shrink-0 shadow-md ${
              inStock
                ? 'bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
            aria-label={inStock ? `Agregar ${product.name} al carrito` : `${product.name} agotado`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
