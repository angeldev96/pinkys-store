import { Truck, ShieldCheck, Sparkles, HandCoins, Gem, Heart } from 'lucide-react';

const FEATURES = [
  { Icon: Truck, label: 'Envíos a todo Honduras' },
  { Icon: HandCoins, label: 'Pago contra entrega' },
  { Icon: ShieldCheck, label: 'Productos 100% originales' },
  { Icon: Sparkles, label: 'Nuevos ingresos cada semana' },
  { Icon: Gem, label: 'Joyería que no se decolora' },
  { Icon: Heart, label: 'Atención por WhatsApp' },
];

/**
 * Infinite benefits ticker. The list is rendered twice and the track slides
 * exactly -50%, so the loop is seamless with a single CSS animation.
 */
export function FeatureMarquee() {
  return (
    <section
      aria-label="Beneficios de comprar en Pinky's Store"
      className="relative border-y border-primary/10 bg-card/50 backdrop-blur-sm py-3 sm:py-4"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {FEATURES.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 whitespace-nowrap px-5 sm:px-8 text-xs sm:text-sm font-medium text-primary/80"
                >
                  <Icon className="w-4 h-4 text-accent shrink-0" />
                  {label}
                  <span className="ml-5 sm:ml-8 h-1.5 w-1.5 rounded-full bg-accent/50" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureMarquee;
