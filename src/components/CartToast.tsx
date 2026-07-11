"use client";

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface CartToastProps {
  message: string | null;
  key?: number;
}

export function CartToast({ message }: CartToastProps) {
  const [visible, setVisible] = useState(!!message);
  const [prevMessage, setPrevMessage] = useState(message);

  if (message !== prevMessage) {
    setPrevMessage(message);
    setVisible(!!message);
  }

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] fade-in pointer-events-none">
      <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg">
        <div className="p-1 bg-green-500 rounded-full">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
}
