
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from './LoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-enter');
    } else {
      setAnimationClass('animate-exit');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`glass-card p-0 border-0 overflow-hidden w-full max-w-md ${animationClass}`}>
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-warning-purple/20 rounded-full filter blur-[80px] opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-warning-purple/20 rounded-full filter blur-[80px] opacity-50 -z-10"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8">
          <LoginForm onLogin={onLogin} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
