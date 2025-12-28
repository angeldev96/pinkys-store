import { Search, ShoppingBag, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ cartCount, onCartClick, searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/pinkys-logo.jpg"
              alt="Pinky's Store"
              className="h-12 w-12 object-cover rounded-full border-2 border-primary/20"
            />
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-primary">Pinky's</h1>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Store</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full hover:bg-secondary transition-colors">
              <User className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={onCartClick}
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
