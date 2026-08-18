import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.jpg"
          alt="Pinky's Store - Tienda de maquillaje, joyería y perfumes premium en San Pedro Sula, Honduras"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/60 md:bg-gradient-to-r md:from-background/95 md:via-background/70 md:to-background/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-28">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-secondary/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent sparkle" />
            <span className="text-xs sm:text-sm font-medium text-secondary-foreground">Nueva Colección 2026</span>
          </div>

          {/* Heading - H1 for SEO: primary page heading */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
            Maquillaje, Joyería y Perfumes{' '}
            <span className="text-primary">Premium</span>{' '}
            en Honduras
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Descubre la colección exclusiva de Pinky&apos;s Store. Cosméticos de alta calidad, joyería elegante y fragancias con envío a todo Honduras.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={scrollToCatalog}
              className="btn-primary inline-flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base"
            >
              Ver Ofertas
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToCatalog}
              className="btn-secondary text-sm sm:text-base"
            >
              Nueva Colección
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 border-t border-border/50">
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">500+</div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Productos</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">10k+</div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Clientes</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">4.9★</div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Calificación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

export default Hero;
