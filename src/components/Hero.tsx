"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Gem, Heart, Star } from 'lucide-react';
import * as m from 'motion/react-m';
import { useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { CountUp } from '@/components/motion/CountUp';

const container: Variants = {
  hidden: {},
  // Kept short: the h1 is the LCP element, so the entrance must not hold it back.
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Decorative icons that drift around the hero art. */
const FLOATERS = [
  { Icon: Sparkles, className: 'top-[18%] right-[12%] text-accent', size: 'w-6 h-6', delay: '0s' },
  { Icon: Gem, className: 'top-[52%] right-[26%] text-fuchsia-400', size: 'w-5 h-5', delay: '-3s' },
  { Icon: Heart, className: 'top-[32%] right-[42%] text-pink-400', size: 'w-4 h-4', delay: '-5s' },
  { Icon: Star, className: 'bottom-[18%] right-[16%] text-amber-400', size: 'w-5 h-5', delay: '-7s' },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Slow parallax on the banner so the hero has depth while scrolling away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <m.div
          className="absolute inset-0 -bottom-[18%]"
          style={reduced ? undefined : { y: imageY }}
        >
          <Image
            src="/hero-banner.jpg"
            alt="Pinky's Store - Tienda de maquillaje, joyería y perfumes premium en San Pedro Sula, Honduras"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/60 md:bg-gradient-to-r md:from-background/95 md:via-background/70 md:to-background/40" />
        {/* Colour wash that ties the banner into the aurora behind the page. */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_15%_20%,hsl(330_95%_75%/0.30),transparent_60%),radial-gradient(70%_60%_at_85%_80%,hsl(45_95%_70%/0.25),transparent_60%)]" />
      </div>

      {/* Floating decorative icons */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {FLOATERS.map(({ Icon, className, size, delay }, i) => (
          <Icon
            key={i}
            className={`absolute drift-float opacity-70 ${size} ${className}`}
            style={{ animationDelay: delay }}
          />
        ))}
      </div>

      {/* Content */}
      <m.div
        className="relative container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-28"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <m.div className="max-w-xl" variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <m.div variants={item}>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-card/70 backdrop-blur-md ring-1 ring-primary/15 shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent sparkle" />
              <span className="text-xs sm:text-sm font-medium text-secondary-foreground">Nueva Colección 2026</span>
            </div>
          </m.div>

          {/* Heading - H1 for SEO: primary page heading */}
          <m.h1
            variants={item}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-3 sm:mb-4"
          >
            Maquillaje, Joyería y Perfumes{' '}
            <span className="text-aurora">Premium</span>{' '}
            en Honduras
          </m.h1>

          {/* Subheading */}
          <m.p
            variants={item}
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed"
          >
            Descubre la colección exclusiva de Pinky&apos;s Store. Cosméticos de alta calidad, joyería elegante y fragancias con envío a todo Honduras.
          </m.p>

          {/* CTAs */}
          <m.div variants={item} className="flex flex-wrap gap-3 sm:gap-4">
            <m.button
              onClick={scrollToCatalog}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="btn-primary cta-glow inline-flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base"
            >
              Ver Ofertas
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </m.button>
            <m.button
              onClick={scrollToCatalog}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="btn-secondary bg-card/70 backdrop-blur-md text-sm sm:text-base"
            >
              Nueva Colección
            </m.button>
          </m.div>

          {/* Stats */}
          <m.div
            variants={item}
            className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 border-t border-border/50"
          >
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">
                <CountUp to={500} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Productos</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">
                <CountUp to={10} suffix="k+" />
              </div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Clientes</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-display font-bold text-primary">
                <CountUp to={4.9} decimals={1} suffix="★" />
              </div>
              <div className="text-[10px] sm:text-xs sm:text-sm text-muted-foreground">Calificación</div>
            </div>
          </m.div>
        </m.div>
      </m.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

export default Hero;
