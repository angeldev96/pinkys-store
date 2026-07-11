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
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 z-50 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-pink-300 disabled:to-pink-400 text-white rounded-full shadow-xl shadow-pink-600/40 ring-4 ring-white/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Agregar producto"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </button>
  );
}
