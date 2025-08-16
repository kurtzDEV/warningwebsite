import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { detectSuspiciousActivity, isTokenExpired, SECURITY_CONFIG } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  type: 'suspicious_activity' | 'session_expired' | 'multiple_logins' | 'unusual_behavior';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

const SecurityMonitor = () => {
  const { user, session, isSessionValid, getSessionAge } = useAuth();
  const { toast } = useToast();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Monitorar atividade do usuário
  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Verificar sessão periodicamente
  useEffect(() => {
    const checkSession = () => {
      if (session && !isSessionValid()) {
        const event: SecurityEvent = {
          type: 'session_expired',
          message: 'Sessão expirada por inatividade',
          timestamp: new Date(),
          severity: 'high'
        };
        
        setSecurityEvents(prev => [...prev, event]);
        
        toast({
          title: "Sessão Expirada",
          description: "Sua sessão expirou por segurança. Faça login novamente.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkSession, 60000); // Verificar a cada minuto
    return () => clearInterval(interval);
  }, [session, isSessionValid, toast]);

  // Detectar atividade suspeita
  useEffect(() => {
    const checkSuspiciousActivity = () => {
      const userAgent = navigator.userAgent;
      const isSuspicious = detectSuspiciousActivity(userAgent, 'client-side');

      if (isSuspicious) {
        const event: SecurityEvent = {
          type: 'suspicious_activity',
          message: 'Atividade suspeita detectada',
          timestamp: new Date(),
          severity: 'medium'
        };
        
        setSecurityEvents(prev => [...prev, event]);
        
        // Log da atividade suspeita
        if (user) {
          supabase
            .from('user_activities')
            .insert([
              {
                user_id: user.id,
                activity_type: 'suspicious_activity_detected',
                activity_data: {
                  user_agent: userAgent,
                  timestamp: new Date().toISOString(),
                  type: 'automated_tool_detected'
                }
              }
            ])
            .catch(console.error);
        }
      }
    };

    checkSuspiciousActivity();
  }, [user]);

  // Monitorar inatividade
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const warningThreshold = 10 * 60 * 1000; // 10 minutos
      const logoutThreshold = 30 * 60 * 1000; // 30 minutos

      if (inactiveTime > logoutThreshold && user) {
        const event: SecurityEvent = {
          type: 'session_expired',
          message: 'Logout automático por inatividade',
          timestamp: new Date(),
          severity: 'high'
        };
        
        setSecurityEvents(prev => [...prev, event]);
        
        // Logout automático
        supabase.auth.signOut();
      } else if (inactiveTime > warningThreshold && user) {
        const event: SecurityEvent = {
          type: 'unusual_behavior',
          message: 'Inatividade detectada',
          timestamp: new Date(),
          severity: 'low'
        };
        
        setSecurityEvents(prev => [...prev, event]);
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Verificar a cada minuto
    return () => clearInterval(interval);
  }, [lastActivity, user]);

  // Verificar idade da sessão
  useEffect(() => {
    const checkSessionAge = () => {
      const sessionAge = getSessionAge();
      const maxAge = SECURITY_CONFIG.SESSION_TIMEOUT;

      if (sessionAge > maxAge && user) {
        const event: SecurityEvent = {
          type: 'session_expired',
          message: 'Sessão expirada por tempo limite',
          timestamp: new Date(),
          severity: 'high'
        };
        
        setSecurityEvents(prev => [...prev, event]);
        
        toast({
          title: "Sessão Expirada",
          description: "Sua sessão expirou por segurança. Faça login novamente.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkSessionAge, 300000); // Verificar a cada 5 minutos
    return () => clearInterval(interval);
  }, [getSessionAge, user, toast]);

  // Limpar eventos antigos (manter apenas os últimos 10)
  useEffect(() => {
    if (securityEvents.length > 10) {
      setSecurityEvents(prev => prev.slice(-10));
    }
  }, [securityEvents]);

  // Componente invisível - apenas monitora
  return null;
};

export default SecurityMonitor;


