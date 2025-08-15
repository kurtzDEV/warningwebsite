
import { useState, useEffect, useCallback } from 'react';

interface UseIdleTimerProps {
  timeout?: number; // tempo em milissegundos
  onIdle?: () => void;
  onActive?: () => void;
}

const useIdleTimer = ({
  timeout = 30 * 60 * 1000, // 30 minutos por padrão
  onIdle,
  onActive,
}: UseIdleTimerProps) => {
  const [isIdle, setIsIdle] = useState(false);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  
  const handleActivity = useCallback(() => {
    if (isIdle && onActive) {
      onActive();
    }
    
    setIsIdle(false);
    
    if (timer) {
      window.clearTimeout(timer);
    }
    
    const newTimer = window.setTimeout(() => {
      setIsIdle(true);
      if (onIdle) {
        onIdle();
      }
    }, timeout);
    
    setTimer(newTimer);
  }, [isIdle, onActive, onIdle, timeout, timer]);
  
  useEffect(() => {
    const events = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'wheel'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    // Iniciar o timer
    handleActivity();
    
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, timer]);
  
  return { isIdle };
};

export default useIdleTimer;
