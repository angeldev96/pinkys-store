"use client";

import Image from 'next/image';
import { Plus } from 'lucide-react';
import * as m from 'motion/react-m';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView?: (product: Product) => void;
  /** Position in the grid; used to stagger the scroll-in animation. */
  index?: number;
}

// Shades chosen so white text keeps a >= 4.5:1 contrast ratio (WCAG AA).
export const badgeStyles: Record<string, string> = {
  'Nuevo': 'bg-blue-700 text-white',
  'Oferta': 'bg-orange-700 text-white',
  'Bestseller': 'bg-green-700 text-white',
  'Premium': 'bg-purple-700 text-white',
};

const ProductCard = ({ product, onAddToCart, onView, index = 0 }: ProductCardProps) => {
  const handleCardClick = () => {
    if (onView) {
      onView(product);
    }
  };

  const inStock = (product.stock ?? 0) > 0;

  return (
    <m.article
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      // Stagger resets every row-of-eight so late products don't wait seconds.
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 ring-1 ring-primary/5 overflow-hidden hover:shadow-[0_18px_40px_-12px_hsl(340_60%_35%/0.35)] transition-shadow duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 shine">
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
          <m.button
            onClick={(e) => {
              e.stopPropagation();
              if (inStock) onAddToCart(product);
            }}
            disabled={!inStock}
            whileHover={inStock ? { scale: 1.12, rotate: 90 } : undefined}
            whileTap={inStock ? { scale: 0.9 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className={`p-2 rounded-lg shrink-0 shadow-md ${
              inStock
                ? 'bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
            aria-label={inStock ? `Agregar ${product.name} al carrito` : `${product.name} agotado`}
          >
            <Plus className="w-5 h-5" />
          </m.button>
        </div>
      </div>
    </m.article>
  );
};

export default ProductCard;
