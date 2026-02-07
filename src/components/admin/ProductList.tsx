import { ProductCard } from './ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase';
import { Edit, Trash2, Search, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  genero: ProductGender;
  image_url: string | null;
  badge: ProductBadge | null;
  stock: number;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  searchQuery: string;
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

export function ProductList({ products, loading, searchQuery, onEdit, onDelete }: ProductListProps) {
  const { isMobile } = useIsMobile();

  const getStockColor = (stock: number) => {
    if (stock > 10) return 'bg-green-100 text-green-700';
    if (stock > 0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Mobile view - Cards
  if (isMobile) {
    return (
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-gray-500 mt-3">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No se encontraron productos' : 'No hay productos'}
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    );
  }

  // Desktop/Tablet view - Table
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badge
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {categoryLabels[product.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-pink-50 text-pink-700 rounded-full">
                      {generoLabels[product.genero] || 'Unisex'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    L{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(product.stock)}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.badge ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColors[product.badge]}`}>
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product.id)}
                        className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
