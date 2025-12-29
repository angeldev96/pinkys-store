import { X, Plus, ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product } from '@/data/products';

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailDrawer({ isOpen, onClose, product, onAddToCart }: ProductDetailDrawerProps) {
  const { isMobile } = useIsMobile();

  if (!isOpen || !product) return null;

  // On desktop, don't show the drawer (products are visible in grid)
  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 fade-in"
        onClick={onClose}
      />

      {/* Drawer - Full screen on mobile */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col slide-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg touch-target fade-in scale-on-active"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Product Image - Full width */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 fade-in">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain fade-in-scale"
          />
        </div>

        {/* Product Info - Bottom sheet */}
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-safe-bottom -mt-6 relative z-10 slide-in-up">
          {/* Category */}
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium fade-in">
            {product.category}
          </span>

          {/* Name */}
          <h2 className="font-display text-2xl font-bold text-gray-900 mt-2 fade-in">
            {product.name}
          </h2>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-3xl font-bold text-pink-600 fade-in-scale">
              L{product.price.toFixed(2)}
            </span>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 touch-target shadow-lg shadow-pink-600/20 scale-on-active"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>

          {/* Description hint */}
          <p className="text-sm text-gray-500 mt-4 text-center fade-in">
            Desliza hacia abajo para cerrar
          </p>
        </div>
      </div>
    </>
  );
}
