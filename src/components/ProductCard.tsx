import { Plus } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onView }: ProductCardProps) => {
  const handleCardClick = () => {
    if (onView) {
      onView(product);
    }
  };

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
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium">
          {product.category}
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
              onAddToCart(product);
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-lg transition-all duration-200 scale-on-active shrink-0 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
