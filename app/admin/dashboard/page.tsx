"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  Plus,
  LogOut,
  Package,
  Search,
  Loader2,
  X,
  Check,
  ShoppingBag,
  ClipboardList,
} from 'lucide-react';
import { productsApi, type Product as SupabaseProduct, ProductCategory, ProductGender, ProductBadge } from '@/lib/supabase';
import { ProductList } from '@/components/admin/ProductList';
import { FloatingActionButton } from '@/components/admin/FloatingActionButton';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { OrdersList } from '@/components/admin/OrdersList';
import { useIsMobile } from '@/hooks/use-mobile';
import { fileToImagePayload } from '@/lib/imagePayload';

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'maquillaje', label: 'Maquillaje' },
  { value: 'joyeria', label: 'Joyería' },
  { value: 'perfumes', label: 'Perfumes' },
  { value: 'accesorios', label: 'Accesorios' },
];

const generos: { value: ProductGender; label: string }[] = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'caballero', label: 'Caballero' },
  { value: 'dama', label: 'Dama' },
];

const badges: { value: ProductBadge | null; label: string }[] = [
  { value: null, label: 'Sin badge' },
  { value: 'Nuevo', label: 'Nuevo' },
  { value: 'Oferta', label: 'Oferta' },
  { value: 'Bestseller', label: 'Bestseller' },
  { value: 'Premium', label: 'Premium' },
];

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

interface FormData {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  genero: ProductGender;
  image_url: string;
  badge: ProductBadge | null;
  stock: string;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  price: '',
  category: 'maquillaje',
  genero: 'unisex',
  image_url: '',
  badge: null,
  stock: '0',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [analyzing, setAnalyzing] = useState(false);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    // fetch-on-mount: state updates happen after await, not synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      genero: product.genero || 'unisex',
      image_url: product.image_url || '',
      badge: product.badge,
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showNotification('success', 'Producto eliminado correctamente');
      fetchProducts();
    } catch (error: any) {
      showNotification('error', error.message);
    }
  };

  // Sends the captured photo to the vision model and fills the empty fields of
  // the form. Never overwrites what the user (or the edited product) already has.
  const handleAiAnalyze = useCallback(async (file: File) => {
    setAnalyzing(true);
    const isNewProduct = editingProduct === null;

    try {
      const payload = await fileToImagePayload(file);

      const res = await fetch('/api/ai/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        showNotification('error', result.error || 'No se pudo analizar la imagen');
        return;
      }

      if (!result.detected) {
        showNotification('error', result.notes || 'No se reconoció el producto en la foto');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        name: prev.name.trim() ? prev.name : result.name,
        description: prev.description.trim() ? prev.description : result.description,
        category: isNewProduct ? result.category : prev.category,
        genero: isNewProduct ? result.genero : prev.genero,
        badge: isNewProduct && !prev.badge ? result.badge : prev.badge,
      }));

      showNotification('success', 'Ficha completada con IA, revisa y pon el precio');
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'No se pudo analizar la imagen'
      );
    } finally {
      setAnalyzing(false);
    }
  }, [editingProduct, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        genero: formData.genero,
        image_url: formData.image_url || null,
        badge: formData.badge,
        stock: parseInt(formData.stock) || 0,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        showNotification('success', 'Producto actualizado correctamente');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        showNotification('success', 'Producto creado correctamente');
      }

      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl md:text-2xl font-bold text-pink-600 truncate">
                Pinky&apos;s Store
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Panel de Administración</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 md:px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition touch-target"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Stats - Mobile Horizontal Scroll, Desktop Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scroll-snap-x">
          <div className="min-w-[200px] md:min-w-0 bg-white rounded-xl shadow-sm p-4 md:p-6 snap-x">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-pink-100 rounded-lg shrink-0">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Total Productos</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="min-w-[200px] md:min-w-0 bg-white rounded-xl shadow-sm p-4 md:p-6 snap-x">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-green-100 rounded-lg shrink-0">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Total Stock</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="min-w-[200px] md:min-w-0 bg-white rounded-xl shadow-sm p-4 md:p-6 snap-x">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-purple-100 rounded-lg shrink-0">
                <span className="text-xl md:text-2xl font-bold text-purple-600">L</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Valor Total</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  L{products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString('es-HN', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'products'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Pedidos
          </button>
        </div>

        {activeTab === 'products' ? (
          <>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none input-touch"
                />
              </div>
              {!isMobile && (
                <button
                  onClick={handleCreate}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition touch-target"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Producto
                </button>
              )}
            </div>

            {/* Products - Dual View (Cards/Table) */}
            <ProductList
              products={filteredProducts}
              loading={loading}
              searchQuery={searchQuery}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <OrdersList />
        )}

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only - Products Tab) */}
      {activeTab === 'products' && <FloatingActionButton onClick={handleCreate} />}

      {/* Modal - Optimized for Mobile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-4 md:px-8 md:py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="hidden md:block text-sm text-gray-500 mt-0.5">
                  {editingProduct
                    ? 'Actualiza los datos del producto'
                    : 'Completa los datos para agregarlo al catálogo'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-5">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onUploading={(isUploading) => setSaving(isUploading)}
                onFilePicked={handleAiAnalyze}
                analyzing={analyzing}
              />

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Precio (L) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Género *
                  </label>
                  <select
                    required
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value as ProductGender })}
                    className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                  >
                    {generos.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Badge
                  </label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge: e.target.value ? (e.target.value as ProductBadge) : null,
                      })
                    }
                    className="w-full px-4 py-3 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 focus:bg-white outline-none transition-colors input-touch"
                  >
                    {badges.map((badge) => (
                      <option key={badge.label} value={badge.value || ''}>
                        {badge.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sticky Submit Button for Mobile */}
              <div className="sticky bottom-0 bg-white pt-4 pb-safe-bottom border-t border-gray-100">
                <div className="flex gap-3 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 md:flex-none md:px-6 px-4 py-3 md:py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition touch-target"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 md:flex-none md:px-8 px-4 py-3 md:py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium rounded-xl shadow-sm shadow-pink-600/30 transition flex items-center justify-center gap-2 touch-target"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : editingProduct ? (
                      'Actualizar'
                    ) : (
                      'Crear'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-auto md:max-w-sm px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
