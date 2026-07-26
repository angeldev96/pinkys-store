import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Product } from '@/data/products';
import { ProductVariant, availableVariants, hasVariants } from '@/lib/variants';
import { productGallery } from '@/lib/images';

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, variant?: ProductVariant | null) => void;
}

const badgeStyles: Record<string, string> = {
  'Nuevo': 'bg-blue-500 text-white',
  'Oferta': 'bg-orange-500 text-white',
  'Bestseller': 'bg-green-500 text-white',
  'Premium': 'bg-purple-500 text-white',
};

export function ProductDetailDrawer({ isOpen, onClose, product, onAddToCart }: ProductDetailDrawerProps) {
  const [selectedToneId, setSelectedToneId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [shownProductId, setShownProductId] = useState<string | null>(null);

  // Al cambiar de producto se olvida el tono y la foto del anterior. Si solo hay
  // un tono disponible, se preselecciona para no pedir un clic de más.
  if (product && product.id !== shownProductId) {
    setShownProductId(product.id);
    const inStockTones = availableVariants(product.variants);
    const onlyTone = inStockTones.length === 1 ? inStockTones[0] : null;
    setSelectedToneId(onlyTone?.id ?? null);
    setActiveImage(onlyTone?.image_url ?? null);
  }

  if (!isOpen || !product) return null;

  const withTones = hasVariants(product.variants);
  const tones = product.variants || [];
  const inStockTones = availableVariants(tones);
  const inStock = withTones ? inStockTones.length > 0 : (product.stock ?? 0) > 0;

  const selectedTone = withTones
    ? tones.find((tone) => tone.id === selectedToneId) || null
    : null;
  const canAdd = inStock && (!withTones || selectedTone !== null);

  const gallery = productGallery(product);
  const mainImage = activeImage || selectedTone?.image_url || product.image;

  const selectTone = (tone: ProductVariant) => {
    setSelectedToneId(tone.id);
    if (tone.image_url) setActiveImage(tone.image_url);
  };

  // Tocar una foto de la galería que pertenece a un tono también lo elige.
  const selectImage = (url: string) => {
    setActiveImage(url);
    const owner = tones.find((tone) => tone.image_url === url && tone.stock > 0);
    if (owner) setSelectedToneId(owner.id);
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAddToCart(product, selectedTone);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 fade-in"
        onClick={onClose}
      />

      {/* Full screen en móvil, modal centrado en desktop */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 pointer-events-none">
        <div className="relative bg-white w-full h-full md:h-auto md:max-h-[88vh] md:max-w-4xl md:rounded-2xl md:shadow-2xl flex flex-col md:flex-row overflow-hidden slide-in-up pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg touch-target fade-in scale-on-active"
          >
            <X className="w-6 h-6 md:w-5 md:h-5" />
          </button>

          {/* Foto principal + galería */}
          <div className="relative flex-1 md:flex-none md:w-1/2 md:shrink-0 bg-gray-50 flex flex-col items-center justify-center p-6 md:p-8 gap-3 fade-in min-h-0">
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              <img
                key={mainImage}
                src={mainImage}
                alt={selectedTone ? `${product.name} - ${selectedTone.name}` : product.name}
                className="max-w-full max-h-full md:max-h-[58vh] object-contain fade-in-scale"
              />
            </div>

            {gallery.length > 1 && (
              <div className="w-full flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                {gallery.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => selectImage(url)}
                    aria-label="Ver foto"
                    className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 scale-on-active ${
                      url === mainImage
                        ? 'border-pink-600 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-bold rounded-full shadow-md ${badgeStyles[product.badge] || 'bg-gray-500 text-white'}`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none p-6 pb-safe-bottom -mt-6 md:mt-0 relative z-10 slide-in-up md:flex-1 md:overflow-y-auto">
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

            {/* Selector de tono: la foto de cada tono es el swatch */}
            {withTones && (
              <div className="mt-5 fade-in">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-900">Tono</span>
                  <span className="text-sm text-gray-500 truncate">
                    {selectedTone ? selectedTone.name : 'elegí uno'}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {tones.map((tone) => {
                    const soldOut = tone.stock <= 0;
                    const selected = tone.id === selectedToneId;

                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => !soldOut && selectTone(tone)}
                        disabled={soldOut}
                        aria-pressed={selected}
                        title={soldOut ? `${tone.name} (agotado)` : tone.name}
                        className={`relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 transition-all duration-200 scale-on-active ${
                          soldOut
                            ? 'border-gray-200 opacity-40 cursor-not-allowed'
                            : selected
                              ? 'border-pink-600 ring-2 ring-pink-500/30'
                              : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {tone.image_url ? (
                          <img
                            src={tone.image_url}
                            alt={tone.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center px-1 text-[10px] font-semibold text-gray-600 text-center leading-tight">
                            {tone.name}
                          </span>
                        )}
                        {soldOut && (
                          <span className="absolute inset-x-0 bottom-0 bg-gray-900/70 text-white text-[8px] font-bold py-0.5">
                            AGOTADO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!selectedTone && inStock && (
                  <p className="text-xs text-gray-500 mt-2">
                    Tocá un tono para agregarlo al carrito
                  </p>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-3xl font-bold text-pink-600 fade-in-scale">
                L{product.price.toFixed(2)}
              </span>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 touch-target shadow-lg shadow-pink-600/20 scale-on-active transition-all"
              >
                <Plus className="w-5 h-5" />
                {!inStock ? 'Agotado' : canAdd ? 'Agregar' : 'Elegí un tono'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
