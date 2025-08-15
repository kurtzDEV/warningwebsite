
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import DesktopNavigation from './navbar/DesktopNavigation';
import UserActions from './navbar/UserActions';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // This is connected to real auth now
  const handleLogin = (email: string, password: string) => {
    signIn(email, password);
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "glass" : "bg-transparent"
      )}>
        <div className="container px-4 mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png" 
              alt="Warning Bypass Logo" 
              className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="font-display text-xl font-bold text-gradient">WARNING</span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Call To Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <UserActions 
              isLoggedIn={!!user}
              totalItems={totalItems}
              onLoginClick={handleLoginClick}
              onCartClick={handleCartClick}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-warning-purple/20 relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5 text-white/80" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-warning-purple text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
            
            <button onClick={toggleMobileMenu} className="text-white">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          isLoggedIn={!!user}
          onClose={() => setMobileMenuOpen(false)}
          onLoginClick={handleLoginClick}
        />
      </header>

      {/* Modals and Drawers */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      
      <CartDrawer 
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </>
  );
};

export default Navbar;
