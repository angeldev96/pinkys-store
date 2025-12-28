import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Heart } from 'lucide-react';
import logo from '@/assets/pinkys-logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Pinky's Store" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-display text-xl font-bold">Pinky's Store</h3>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Tu destino para cosméticos premium, joyería elegante y fragancias exclusivas.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2">
              {['Inicio', 'Productos', 'Ofertas', 'Sobre Nosotros', 'Blog'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ayuda</h4>
            <ul className="space-y-2">
              {['Preguntas Frecuentes', 'Envíos', 'Devoluciones', 'Métodos de Pago', 'Contacto'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Ciudad de México, MX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+52 (55) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hola@pinkysstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 Pinky's Store. Todos los derechos reservados.
          </p>
          <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-destructive fill-destructive" /> en México
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
