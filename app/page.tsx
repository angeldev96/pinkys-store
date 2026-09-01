"use client";

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import { AuroraBackground } from '@/components/AuroraBackground';
import { FeatureMarquee } from '@/components/FeatureMarquee';
import { MotionProvider } from '@/components/motion/MotionProvider';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CartToast } from '@/components/CartToast';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart
  } = useCart();

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    setToastMessage(`${product.name} agregado al carrito`);
    setToastKey(k => k + 1);
  }, [addToCart]);

  return (
    <MotionProvider>
      {/* Transparent wrapper: the fixed aurora sits behind the whole page. */}
      <div className="relative min-h-screen bg-transparent">
        <AuroraBackground />

        <Header
          cartCount={totalItems}
          onCartClick={openCart}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main>
          <Hero />
          <FeatureMarquee />
          <Catalog
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
          />
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          totalPrice={totalPrice}
        />

        <WhatsAppButton />
        <CartToast key={toastKey} message={toastMessage} />
      </div>
    </MotionProvider>
  );
}
