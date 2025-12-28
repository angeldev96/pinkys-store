import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`, {
      description: 'Continúa comprando o finaliza tu pedido',
      action: {
        label: 'Ver Carrito',
        onClick: openCart
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" richColors />
      
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
    </div>
  );
};

export default Index;
