"use client";

import { X, Plus, Minus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { CartItem } from '@/data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  totalPrice: number;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50495825388';

const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  totalPrice
}: CartDrawerProps) => {
  if (!isOpen) return null;

  const handleWhatsAppOrder = () => {
    let message = '\u{1F338} *PEDIDO PINKY\'S STORE*\n\n';
    message += 'Hola! Me gustaría ordenar los siguientes productos:\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: L${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `\u{1F4B0} *TOTAL: L${totalPrice.toFixed(2)}*\n\n`;
    message += '¿Me puedes confirmar la disponibilidad? \u{1F64F}';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl flex flex-col slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 fade-in">
            <div className="p-2 bg-pink-100 rounded-lg fade-in-scale">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-gray-900">
                Mi Carrito
              </h2>
              <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 scale-on-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 fade-in">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 fade-in-scale">
                <ShoppingBag className="w-10 h-10 text-pink-600" />
              </div>
              <p className="text-gray-900 text-lg font-medium mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500 mb-6">
                Agrega productos que te interesen
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-all duration-200 touch-target scale-on-active"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="space-y-3 stagger-in">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {item.category} · {item.genero}
                      </p>
                      <p className="font-bold text-pink-600 text-base mt-1">
                        L{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 scale-on-active"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 scale-on-active"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 scale-on-active"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white shadow-lg slide-in-up">
            {/* Order Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm fade-in">
                <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
                <span className="font-medium text-gray-900">L{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 fade-in">
                <span className="font-display font-semibold text-lg text-gray-900">Total</span>
                <span className="font-display font-bold text-2xl text-pink-600">
                  L{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 touch-target shadow-lg shadow-green-500/20 scale-on-active"
            >
              <MessageCircle className="w-5 h-5" />
              Ordenar por WhatsApp
            </button>

            <p className="text-xs text-gray-500 text-center mt-3 fade-in">
              Serás redirigido a WhatsApp para confirmar tu pedido
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
