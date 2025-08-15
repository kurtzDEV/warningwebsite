
import { Link } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const MobileMenu = ({ isOpen, isLoggedIn, onClose, onLoginClick }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden glass animate-fade-in py-4">
      <div className="container px-4 mx-auto flex flex-col space-y-4">
        <Link 
          to="/" 
          className="text-white py-2 border-b border-white/10"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            window.scrollTo({ 
              top: 0, 
              behavior: 'smooth' 
            });
          }}
        >
          Home
        </Link>
        <div className="py-2 border-b border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-white">Produtos</span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </div>
          <div className="pl-4 mt-2 space-y-2">
            <Link 
              to="/" 
              className="block text-sm text-white/80 hover:text-warning-purple"
              onClick={(e) => {
                e.preventDefault();
                onClose();
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
            <Link 
              to="/" 
              className="block text-sm text-white/80 hover:text-warning-purple"
              onClick={onClose}
            >
              Rainbow Six Macros
            </Link>
          </div>
        </div>
        <Link 
          to="/about" 
          className="text-white py-2 border-b border-white/10"
          onClick={onClose}
        >
          Sobre
        </Link>
        <Link 
          to="https://discord.gg/warningbypass" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-white py-2 border-b border-white/10"
          onClick={onClose}
        >
          Contato
        </Link>
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="text-white py-2 border-b border-white/10 flex items-center"
            onClick={onClose}
          >
            <User className="h-4 w-4 mr-2" /> Minha Conta
          </Link>
        ) : (
          <button 
            onClick={() => {
              onLoginClick();
              onClose();
            }}
            className="gradient-button rounded-full w-full py-2"
          >
            Entrar
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
