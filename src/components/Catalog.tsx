"use client";

import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { Product, products } from '@/data/products';
import ProductCard from './ProductCard';

type Category = 'todo' | 'maquillaje' | 'joyeria' | 'perfumes' | 'accesorios';

interface CatalogProps {
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

const categories: { id: Category; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'maquillaje', label: 'Maquillaje' },
  { id: 'joyeria', label: 'Joyería' },
  { id: 'perfumes', label: 'Perfumes' },
  { id: 'accesorios', label: 'Accesorios' },
];

const Catalog = ({ searchQuery, onAddToCart }: CatalogProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('todo');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'todo') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

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
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Explora nuestra colección curada de productos premium para tu belleza
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-2 mb-8 sm:mb-10 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-tab shrink-0 snap-start ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No se encontraron productos
            </p>
            <button
              onClick={() => setActiveCategory('todo')}
              className="btn-secondary mt-4"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
