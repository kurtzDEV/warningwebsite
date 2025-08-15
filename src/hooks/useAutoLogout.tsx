
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useIdleTimer from './useIdleTimer';

interface UseAutoLogoutProps {
  timeout?: number; // tempo em milissegundos
  showWarning?: boolean;
}

/**
 * Hook para logout automático após um período de inatividade
 */
const useAutoLogout = ({
  timeout = 30 * 60 * 1000, // 30 minutos por padrão
  showWarning = true
}: UseAutoLogoutProps = {}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Função para logout
  const handleIdle = async () => {
    if (user) {
      await signOut();
      navigate('/');
      
      if (showWarning) {
        toast.warning('Sessão expirada', {
          description: 'Você foi desconectado por inatividade.',
          duration: 5000,
        });
      }
    }
  };

  const { isIdle } = useIdleTimer({
    timeout,
    onIdle: handleIdle,
  });

  return { isIdle };
};

export default useAutoLogout;
