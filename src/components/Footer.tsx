
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black pt-20 pb-10 border-t border-white/10">
      <div className="container px-4 mx-auto">
        {/* Newsletter Section */}
        <div className="glass-card p-8 rounded-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 font-display text-white">
                Fique por dentro das novidades
              </h3>
              <p className="text-white/70">
                Inscreva-se para receber atualizações, novos recursos e ofertas exclusivas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="px-5 py-3 bg-black/60 border border-warning-purple/20 rounded-full text-white focus:outline-none focus:border-warning-purple flex-1"
              />
              <Button className="gradient-button rounded-full">
                Inscrever <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png" 
                alt="Warning Bypass Logo" 
                className="h-8 w-auto"
              />
              <span className="font-display text-xl font-bold text-gradient">WARNING</span>
            </Link>
            <p className="text-white/60 text-sm">
              O Warning Bypass é a solução definitiva para jogadores de FiveM que buscam uma experiência sem limitações.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-warning-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-warning-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-warning-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-warning-purple transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-white/60 hover:text-warning-purple transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ 
                      top: 0, 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-warning-purple transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-warning-purple transition-colors text-sm">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-warning-purple transition-colors text-sm">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link 
                  to="https://discord.gg/warningbypass" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-warning-purple transition-colors text-sm"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Nossos Produtos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-white/60 hover:text-warning-purple transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    const productsSection = document.getElementById('products');
                    if (productsSection) {
                      productsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                >
                  FiveM Bypass
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-warning-purple transition-colors text-sm">
                  Rainbow Six Macros
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="text-white/60 text-sm">
                <strong className="text-white">Email:</strong> contato@warningbypass.com
              </li>
              <li className="text-white/60 text-sm">
                <strong className="text-white">Suporte:</strong> suporte@warningbypass.com
              </li>
              <li className="text-white/60 text-sm">
                <strong className="text-white">Discord:</strong> discord.gg/warningbypass
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Warning Bypass. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
