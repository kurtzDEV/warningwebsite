
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className="text-white/80 hover:text-warning-purple transition-colors"
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
      <div className="relative group">
        <button className="flex items-center text-white/80 hover:text-warning-purple transition-colors">
          Produtos <ChevronDown className="ml-1 w-4 h-4" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 glass rounded-lg overflow-hidden">
          <div className="py-2">
            <Link 
              to="/" 
              className="block px-4 py-2 text-sm text-white/80 hover:bg-warning-purple/20 hover:text-white"
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
            <Link to="/" className="block px-4 py-2 text-sm text-white/80 hover:bg-warning-purple/20 hover:text-white">
              Rainbow Six Macros
            </Link>
          </div>
        </div>
      </div>
      <Link to="/about" className="text-white/80 hover:text-warning-purple transition-colors">
        Sobre
      </Link>
      <Link 
        to="https://discord.gg/warningbypass" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/80 hover:text-warning-purple transition-colors"
      >
        Contato
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
