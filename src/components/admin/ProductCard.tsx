import { Edit, Trash2 } from 'lucide-react';
import { ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  genero: ProductGender;
  image_url: string | null;
  badge: ProductBadge | null;
  stock: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<ProductCategory, string> = {
  maquillaje: 'Maquillaje',
  joyeria: 'Joyería',
  perfumes: 'Perfumes',
  accesorios: 'Accesorios',
};

const generoLabels: Record<ProductGender, string> = {
  unisex: 'Unisex',
  caballero: 'Caballero',
  dama: 'Dama',
};

const badgeColors: Record<ProductBadge, string> = {
  'Nuevo': 'bg-blue-100 text-blue-700',
  'Oferta': 'bg-orange-100 text-orange-700',
  'Bestseller': 'bg-green-100 text-green-700',
  'Premium': 'bg-purple-100 text-purple-700',
};

export function ProductCard({
  id,
  name,
  description,
  price,
  category,
  genero,
  image_url,
  badge,
  stock,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const getStockColor = (stock: number) => {
    if (stock > 10) return 'bg-green-100 text-green-700';
    if (stock > 0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image & Basic Info */}
      <div className="flex gap-3 p-3">
        {/* Thumbnail Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
              <span className="text-2xl">🌸</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                {name}
              </h3>
              {description && (
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {badge && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${badgeColors[badge]}`}>
                {badge}
              </span>
            )}
          </div>

          {/* Price & Category */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-pink-600">
              L{price.toFixed(2)}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {categoryLabels[category]}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-pink-50 text-pink-600 rounded-full">
              {generoLabels[genero] || 'Unisex'}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStockColor(stock)}`}>
              Stock: {stock}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-200 divide-x divide-gray-200">
        <button
          onClick={() => onEdit(id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-target"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors touch-target"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  );
}
