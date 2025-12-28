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
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.badge === 'Nuevo' ? 'bg-accent text-accent-foreground' :
              product.badge === 'Oferta' ? 'bg-destructive text-destructive-foreground' :
              product.badge === 'Bestseller' ? 'bg-primary text-primary-foreground' :
              'bg-foreground text-background'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
          <Heart className="w-4 h-4 text-primary" />
        </button>

        {/* Quick Add Button - Mobile visible, Desktop on hover */}
        <div className="absolute bottom-3 left-3 right-3 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Añadir al Carrito
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground mt-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
