
import { Button } from '@/components/ui/button';
import { ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserActionsProps {
  isLoggedIn: boolean;
  totalItems: number;
  onLoginClick: () => void;
  onCartClick: () => void;
}

const UserActions = ({ isLoggedIn, totalItems, onLoginClick, onCartClick }: UserActionsProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  return isLoggedIn ? (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-warning-purple/20 relative"
        onClick={onCartClick}
      >
        <ShoppingCart className="h-5 w-5 text-white/80" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-warning-purple text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:bg-warning-purple/20"
        onClick={handleProfileClick}
      >
        <User className="h-5 w-5 text-white/80" />
      </Button>
    </>
  ) : (
    <Button 
      onClick={onLoginClick}
      className="gradient-button hover-glow rounded-full"
    >
      Entrar
    </Button>
  );
};

export default UserActions;
