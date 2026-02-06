"use client";

import { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';

interface CartToastProps {
  message: string | null;
  key?: number;
}

export function CartToast({ message }: CartToastProps) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (message) {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      setDisplayMessage(message);
      setVisible(true);

      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, 2000);
    } else {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] fade-in pointer-events-none">
      <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg">
        <div className="p-1 bg-green-500 rounded-full">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{displayMessage}</span>
      </div>
    </div>
  );
}
