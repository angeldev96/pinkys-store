import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <article className="product-card group fade-in">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30 rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
              product.badge === 'Nuevo' ? 'bg-accent text-accent-foreground' :
              product.badge === 'Oferta' ? 'bg-destructive text-destructive-foreground' :
              product.badge === 'Bestseller' ? 'bg-primary text-primary-foreground' :
              'bg-foreground text-background'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button - Always visible on mobile for touch */}
        <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-2 bg-card/80 backdrop-blur-sm rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-card active:scale-95 transition-transform">
          <Heart className="w-4 h-4 text-primary" />
        </button>

        {/* Quick Add Button - Mobile visible, Desktop on hover */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full btn-primary py-2 sm:py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-[0.98] transition-transform"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Añadir al</span> Carrito
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-sm sm:text-base text-foreground mt-1 line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-0.5 sm:gap-1 mt-1.5 sm:mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-accent text-accent" />
          ))}
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-primary">
            L{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
