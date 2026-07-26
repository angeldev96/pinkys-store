import { useState, useCallback, useEffect } from 'react';
import { Product, CartItem } from '@/data/products';
import { ProductVariant, cartLineId, parseVariants } from '@/lib/variants';

// Versioned so a future change to CartItem can bump the key instead of
// crashing on carts saved by an older build. v2 añadió tonos: cada línea se
// identifica por lineId (producto + tono), ya no por el id del producto.
const STORAGE_KEY = 'pinkys-cart-v2';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.lineId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
  );
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem).map((item) => ({
      ...item,
      variants: parseVariants(item.variants),
    }));
  } catch {
    // Corrupted JSON, or storage blocked (Safari private mode).
    return [];
  }
}

/** Techo de unidades de una línea: el stock del tono, o el del producto. */
function maxQuantity(item: Pick<CartItem, 'variant' | 'stock'>): number {
  const stock = item.variant ? item.variant.stock : item.stock;
  return Number.isFinite(stock) && stock > 0 ? stock : Infinity;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // The first render must match the server-rendered HTML, so the stored cart is
  // read after mount. Until then, saving is skipped so the empty initial state
  // never overwrites what is on disk.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCartItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Quota exceeded or storage disabled: the cart still works in memory.
    }
  }, [cartItems, hydrated]);

  // Keep other open tabs of the store in sync.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setCartItems(readStoredCart());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = useCallback((product: Product, variant?: ProductVariant | null) => {
    const chosen = variant ?? null;
    const lineId = cartLineId(product.id, chosen?.id);

    setCartItems(prev => {
      const existingItem = prev.find(item => item.lineId === lineId);
      if (existingItem) {
        const limit = maxQuantity(existingItem);
        return prev.map(item =>
          item.lineId === lineId
            ? { ...item, quantity: Math.min(item.quantity + 1, limit) }
            : item
        );
      }
      return [...prev, { ...product, lineId, variant: chosen, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    setCartItems(prev => prev.filter(item => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(quantity, maxQuantity(item)) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart
  };
};
