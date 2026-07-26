"use client";

import { useState, useMemo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Product, getProducts, searchProducts } from '@/data/products';
import { ProductVariant } from '@/lib/variants';
import ProductCard from './ProductCard';
import { ProductDetailDrawer } from './ProductDetailDrawer';

type Category = 'todo' | 'maquillaje' | 'joyeria' | 'perfumes' | 'accesorios';
type Gender = 'todo' | 'unisex' | 'caballero' | 'dama';

interface CatalogProps {
  searchQuery: string;
  onAddToCart: (product: Product, variant?: ProductVariant | null) => void;
}

const categories: { id: Category; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'maquillaje', label: 'Maquillaje' },
  { id: 'joyeria', label: 'Joyería' },
  { id: 'perfumes', label: 'Perfumes' },
  { id: 'accesorios', label: 'Accesorios' },
];

const genders: { id: Gender; label: string }[] = [
  { id: 'todo', label: 'Todos' },
  { id: 'dama', label: 'Dama' },
  { id: 'caballero', label: 'Caballero' },
  { id: 'unisex', label: 'Unisex' },
];

const Catalog = ({ searchQuery, onAddToCart }: CatalogProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('todo');
  const [activeGender, setActiveGender] = useState<Gender>('todo');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'todo') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by gender
    if (activeGender !== 'todo') {
      filtered = filtered.filter(p => p.genero === activeGender);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        // Buscar por tono: "labial rosa nude"
        (p.variants || []).some(v => v.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, activeGender, searchQuery, products]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing the product to allow animation to complete
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="catalog" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent sparkle" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Catálogo
            </span>
            <Sparkles className="w-5 h-5 text-accent sparkle" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Catálogo de Maquillaje, Joyería y Perfumes
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Explora nuestra colección de cosméticos, accesorios y fragancias premium con envío a toda Honduras
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-2.5 sm:mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {genders.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGender(g.id)}
              className={`filter-tab ${activeGender === g.id ? 'active' : ''}`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-in">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onView={handleViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No se encontraron productos
            </p>
            <button
              onClick={() => { setActiveCategory('todo'); setActiveGender('todo'); }}
              className="btn-secondary mt-4"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Drawer (Mobile Only) */}
      <ProductDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};

export default Catalog;