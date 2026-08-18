import Image from 'next/image';
import { X, Plus, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product } from '@/data/products';
import { badgeStyles } from './ProductCard';

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailDrawer({ isOpen, onClose, product, onAddToCart }: ProductDetailDrawerProps) {
  const { isMobile } = useIsMobile();

  if (!isOpen || !product) return null;

  if (!isMobile) return null;

  const inStock = (product.stock ?? 0) > 0;

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
          aria-label={`Cerrar detalle de ${product.name}`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Product Image - Full width */}
        <div className="relative flex-1 bg-gray-50 flex items-center justify-center p-8 fade-in">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="100vw"
            className="object-contain p-8 fade-in-scale"
          />
          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-bold rounded-full shadow-md ${badgeStyles[product.badge] || 'bg-gray-600 text-white'}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Info - Bottom sheet */}
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-safe-bottom -mt-6 relative z-10 slide-in-up">
          {/* Category & Stock */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium fade-in">
              {product.category} · {product.genero}
            </span>
            {inStock ? (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium fade-in">
                <Check className="w-3 h-3" />
                En stock
              </span>
            ) : (
              <span className="text-xs text-red-500 font-medium fade-in">
                Agotado
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="font-display text-2xl font-bold text-gray-900 mt-2 fade-in">
            {product.name}
          </h2>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed fade-in">
              {product.description}
            </p>
          )}

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
              disabled={!inStock}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 touch-target shadow-lg shadow-pink-600/20 scale-on-active transition-all"
            >
              <Plus className="w-5 h-5" />
              {inStock ? 'Agregar' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
