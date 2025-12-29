import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '@/data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
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
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
              Tu Carrito
            </h2>
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-sm">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-base sm:text-lg">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground mt-1">
                ¡Agrega algunos productos!
              </p>
              <button
                onClick={onClose}
                className="btn-primary mt-6 min-h-[44px]"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 bg-secondary/30 rounded-xl p-3 fade-in"
                >
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base text-foreground line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                        {item.category}
                      </p>
                      <p className="font-bold text-primary text-sm sm:text-base mt-1">
                        L{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls - Stacked on mobile */}
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-2 sm:p-1.5 bg-card rounded-md hover:bg-secondary transition-colors active:scale-95 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 sm:p-1.5 bg-card rounded-md hover:bg-secondary transition-colors active:scale-95 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors active:scale-95 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-3 sm:p-4 space-y-3 sm:space-y-4 bg-card">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">L{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-sm sm:text-base text-accent font-medium">Gratis</span>
            </div>
            <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-border">
              <span className="font-display font-semibold text-base sm:text-lg">Total</span>
              <span className="font-display font-bold text-lg sm:text-xl text-primary">
                L{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button className="w-full btn-primary py-3 sm:py-3.5 text-sm sm:text-base min-h-[48px]">
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
