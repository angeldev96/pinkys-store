import { ProductCard } from './ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase';
import { ProductVariant } from '@/lib/variants';
import { VariantSwatches } from './VariantSwatches';
import { Edit, Trash2, Search, Loader2, ImageOff } from 'lucide-react';

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
  variants?: ProductVariant[];
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
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Producto
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Categoría
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Género
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Precio
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Badge
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-11 h-11 shrink-0 rounded-lg object-cover ring-1 ring-gray-200 bg-gray-50"
                        />
                      ) : (
                        <div className="w-11 h-11 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageOff className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                        <VariantSwatches variants={product.variants} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block whitespace-nowrap px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {categoryLabels[product.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block whitespace-nowrap px-2.5 py-1 text-xs font-medium bg-pink-50 text-pink-700 rounded-full">
                      {generoLabels[product.genero] || 'Unisex'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                    L{product.price.toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-full ${getStockColor(product.stock)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.badge ? (
                      <span className={`inline-block whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-full ${badgeColors[product.badge]}`}>
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(product.id)}
                        title="Editar"
                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        title="Eliminar"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </div>
        </div>
      )}
    </div>
  );
}
