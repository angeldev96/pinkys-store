"use client";

import { useEffect, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

interface CartToastProps {
  message: string | null;
}

export function CartToast({ message }: CartToastProps) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
      <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg">
        <div className="p-1 bg-green-500 rounded-full">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{displayMessage}</span>
      </div>
    </div>
  );
}
