"use client";

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CartToast } from '@/components/CartToast';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
    // Force new reference so useEffect fires even for same product
    setTimeout(() => setToastMessage(null), 2100);
  }, [addToCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={totalItems}
        onCartClick={openCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        <Hero />
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
      <CartToast message={toastMessage} />
    </div>
  );
}
