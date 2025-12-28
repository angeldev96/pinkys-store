import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '@/data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  totalPrice: number;
}

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  totalPrice 
}: CartDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              Tu Carrito
            </h2>
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-sm">
              {items.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground mt-1">
                ¡Agrega algunos productos!
              </p>
              <button 
                onClick={onClose}
                className="btn-primary mt-6"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 bg-secondary/30 rounded-xl p-3 fade-in"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 bg-card rounded-md hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 bg-card rounded-md hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4 bg-card">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-sm text-accent font-medium">Gratis</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="font-display font-semibold text-lg">Total</span>
              <span className="font-display font-bold text-xl text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button className="w-full btn-primary py-3.5 text-base">
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
