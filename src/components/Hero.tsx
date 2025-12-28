import { Sparkles, ArrowRight } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const Hero = () => {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="Cosméticos premium" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent sparkle" />
            <span className="text-sm font-medium text-secondary-foreground">Nueva Colección 2025</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            Resalta tu{' '}
            <span className="text-primary">belleza</span>{' '}
            única
          </h2>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Descubre nuestra exclusiva selección de cosméticos, joyería y perfumes para realzar tu estilo personal.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToCatalog}
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Ver Ofertas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Nueva Colección
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-border/50">
            <div>
              <div className="text-2xl font-display font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Productos</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Clientes Felices</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Calificación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

export default Hero;
