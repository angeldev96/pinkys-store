"use client";

import { useState } from 'react';
import Image from 'next/image';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, User, Menu, Home, Package, Mail, Sparkles, Gem, Droplets, Brush } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollProgress } from '@/components/ScrollProgress';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories = [
  { id: 'todo', label: 'Todo', icon: Package },
  { id: 'maquillaje', label: 'Maquillaje', icon: Brush },
  { id: 'joyeria', label: 'Joyería', icon: Gem },
  { id: 'perfumes', label: 'Perfumes', icon: Droplets },
  { id: 'accesorios', label: 'Accesorios', icon: Sparkles },
];

const Header = ({ cartCount, onCartClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isMobile } = useIsMobile();

  const handleCategoryClick = (categoryId: string) => {
    setIsMobileMenuOpen(false);
    // Find and click the category tab in the catalog
    setTimeout(() => {
      const catalogSection = document.getElementById('catalog');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
        // Try to find and click the category button
        const categoryButtons = document.querySelectorAll('.filter-tab');
        categoryButtons.forEach((btn) => {
          if (btn.textContent?.toLowerCase() === categoryId.toLowerCase() ||
              (categoryId === 'todo' && btn.textContent === 'Todo')) {
            btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          }
        });
      }
    }, 100);
  };

  const navLinks = [
    { label: 'Inicio', icon: Home, href: '#hero' },
    { label: 'Catálogo', icon: Package, href: '#catalog' },
    { label: 'Contacto', icon: Mail, href: '#contact' },
  ];

  return (
    <m.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_24px_-12px_hsl(340_60%_35%/0.35)]"
    >
      <ScrollProgress />
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Hamburger Menu - Mobile Only */}
            {isMobile && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2.5 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Abrir menú de navegación"
                  >
                    <Menu className="w-5 h-5 text-foreground" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      Menú
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Navigation Links */}
                    <nav className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground px-3">Navegación</p>
                      {navLinks.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            const element = document.querySelector(link.href);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-left"
                        >
                          <link.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{link.label}</span>
                        </button>
                      ))}
                    </nav>

                    <Separator />

                    {/* Categories */}
                    <nav className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground px-3">Categorías</p>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.label)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-left"
                        >
                          <cat.icon className="w-5 h-5 text-accent" />
                          <span className="font-medium">{cat.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <m.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className="relative shrink-0"
            >
              {/* Soft halo so the logo glows against the aurora. */}
              <span
                aria-hidden="true"
                className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-400 via-fuchsia-400 to-amber-300 opacity-60 blur-[6px]"
              />
              <Image
                src="/pinkys-logo.jpg"
                alt="Pinky's Store - Tienda de maquillaje y joyería en Honduras"
                width={48}
                height={48}
                className="relative h-10 sm:h-12 w-10 sm:w-12 object-cover rounded-full border-2 border-white/70"
                priority
              />
            </m.div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-aurora">Pinky&apos;s</span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase block">Store</span>
            </div>
          </div>

          {/* Search Bar - Responsive */}
          {!isMobile && (
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="Buscar productos en Pinky's Store"
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {isMobile && (
            <div className="flex-1 flex justify-end">
              {isSearchOpen ? (
                <div className="absolute inset-x-4 top-3 z-10">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      autoFocus
                      type="search"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onBlur={() => !searchQuery && setIsSearchOpen(false)}
                      aria-label="Buscar productos en Pinky's Store"
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Abrir buscador de productos"
                >
                  <Search className="w-5 h-5 text-foreground" />
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="/admin/login"
              className="p-2.5 rounded-full hover:bg-secondary transition-colors"
              aria-label="Acceso administrador"
            >
              <User className="w-5 h-5 text-foreground" />
            </a>
            <m.button
              onClick={onCartClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
              aria-label={`Carrito de compras${cartCount > 0 ? ` (${cartCount} productos)` : ''}`}
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <m.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-pink-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow-md"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>
          </div>
        </div>
      </div>

      {/* Colour bar that keeps the header tied to the aurora palette. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent"
      />
    </m.header>
  );
};

export default Header;
