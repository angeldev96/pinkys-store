import { Instagram, Facebook, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pinkys-logo.jpg"
                alt="Pinky's Store"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-display text-xl font-bold">Pinky's Store</h3>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Tu destino para cosméticos premium, joyería elegante y fragancias exclusivas.
            </p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Envíos a nivel nacional 🇭🇳
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/pinkysstore2/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/people/Pinkyys-Store/61567252978469/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalog" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="#catalog" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Catálogo
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/50495825388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>San Pedro Sula, Honduras</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <a
                  href="https://www.tiktok.com/@pinkysstore2?lang=es-419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  @pinkysstore2
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:hola@pinkysstore.com"
                  className="hover:text-primary-foreground transition-colors"
                >
                  hola@pinkysstore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Pinky's Store. Todos los derechos reservados.
          </p>
          <a
            href="https://personal-porfolio-tan.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-foreground/60 flex items-center gap-1 hover:text-primary-foreground/80 transition-colors"
          >
            Hecho con <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> por Angel Valladares
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
