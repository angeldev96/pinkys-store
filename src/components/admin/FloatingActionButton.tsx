import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function FloatingActionButton({ onClick, disabled = false }: FloatingActionButtonProps) {
  const { isMobile } = useIsMobile();

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white rounded-full shadow-lg flex items-center justify-center touch-target safe-area-bottom transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Agregar producto"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
