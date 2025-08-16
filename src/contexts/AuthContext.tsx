
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signInOrSignUp: (email: string, password: string, name: string) => Promise<{
    success: boolean;
    error?: string;
    action: 'signin' | 'signup';
  }>;
  signInWithDiscord: () => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  resetPassword: (newPassword: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  isSessionValid: () => boolean;
  getSessionAge: () => number;
};

// Rate limiting para tentativas de login
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

// Validação de força da senha
const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validação de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Logging de atividades suspeitas
const logSuspiciousActivity = async (userId: string | null, activity: string, details: any) => {
  try {
    await supabase
      .from('user_activities')
      .insert([
        {
          user_id: userId,
          activity_type: 'suspicious_activity',
          activity_data: {
            activity,
            details,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client-side', // Em produção, seria obtido do servidor
          }
        }
      ]);
  } catch (error) {
    console.error('Failed to log suspicious activity:', error);
  }
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signInOrSignUp: async () => ({ success: false, action: 'signin' }),
  signInWithDiscord: async () => ({ success: false }),
  signOut: async () => {},
  refreshProfile: async () => {},
  forgotPassword: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  isSessionValid: () => false,
  getSessionAge: () => 0,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const sessionStartTime = useRef<number>(Date.now());

  const isSessionValid = (): boolean => {
    if (!session) return false;
    
    const now = Date.now();
    const sessionAge = now - sessionStartTime.current;
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 horas
    
    return sessionAge < maxSessionAge;
  };

  const getSessionAge = (): number => {
    return Date.now() - sessionStartTime.current;
  };

  const refreshProfile = async () => {
    if (!user) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error loading user profile:', error);
        throw error;
      }
      
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading user profile:', error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          sessionStartTime.current = Date.now();
          try {
            const { data: existingProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error && error.code === 'PGRST116') {
              await createUserProfile(currentSession.user);
            } else if (existingProfile) {
              setProfile(existingProfile);
            }
          } catch (error) {
            console.error('Error handling profile:', error);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          sessionStartTime.current = Date.now();
          try {
            const { data: existingProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error && error.code === 'PGRST116') {
              await createUserProfile(currentSession.user);
            } else if (existingProfile) {
              setProfile(existingProfile);
            }
          } catch (error) {
            console.error('Error handling profile for existing session:', error);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    checkSession().finally(() => {
      clearTimeout(timeoutId);
    });
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        const { data, error } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              username: user.user_metadata?.full_name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
              full_name: user.user_metadata?.full_name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error creating profile:', error);
          throw error;
        }

        setProfile(data);
      } else if (existingProfile) {
        setProfile(existingProfile);
      }
    } catch (error: any) {
      console.error('Error creating/updating user profile:', error);
      toast({
        title: "Erro ao criar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const registerActivity = async (userId: string, activityType: string, activityData?: any) => {
    try {
      await supabase
        .from('user_activities')
        .insert([
          {
            user_id: userId,
            activity_type: activityType,
            activity_data: {
              ...activityData,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
            }
          }
        ]);
    } catch (error) {
      console.error('Failed to register activity:', error);
    }
  };

  const registerLoginStats = async (userId: string) => {
    try {
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingStats) {
        await supabase
          .from('user_stats')
          .update({
            total_logins: existingStats.total_logins + 1,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } else {
        await supabase
          .from('user_stats')
          .insert([
            {
              id: userId,
              total_logins: 1,
              last_login: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
      }
    } catch (error) {
      console.error('Failed to register login stats:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Rate limiting
      const now = Date.now();
      const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
      
      if (attempts.count >= MAX_LOGIN_ATTEMPTS && (now - attempts.lastAttempt) < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 60000);
        await logSuspiciousActivity(null, 'rate_limit_exceeded', { email, attempts: attempts.count });
        return {
          success: false,
          error: `Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`
        };
      }

      // Reset attempts if lockout period has passed
      if ((now - attempts.lastAttempt) >= LOCKOUT_DURATION) {
        loginAttempts.delete(email);
      }

      // Validate email
      if (!validateEmail(email)) {
        return {
          success: false,
          error: 'Email inválido'
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Increment failed attempts
        attempts.count += 1;
        attempts.lastAttempt = now;
        loginAttempts.set(email, attempts);
        
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
          await logSuspiciousActivity(null, 'max_login_attempts_reached', { email });
        }
        
        throw error;
      }
      
      // Reset attempts on successful login
      loginAttempts.delete(email);
      
      if (data.user) {
        await registerLoginStats(data.user.id);
        await registerActivity(data.user.id, 'login_success', { method: 'email' });
      }
      
      sonnerToast.success('Login bem-sucedido', {
        description: 'Bem-vindo de volta!'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast({
        title: "Erro ao entrar",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const signInWithDiscord = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        await registerActivity(data.user.id, 'login_success', { method: 'discord' });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in with Discord:', error.message);
      toast({
        title: "Erro ao entrar com Discord",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Validate email
      if (!validateEmail(email)) {
        return {
          success: false,
          error: 'Email inválido'
        };
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: undefined,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        await registerActivity(data.user.id, 'account_created', { method: 'email' });
      }
      
      sonnerToast.success('Registro bem-sucedido!', {
        description: 'Verifique seu email para confirmar a conta.'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const signInOrSignUp = async (email: string, password: string, name: string) => {
    try {
      // Validate email
      if (!validateEmail(email)) {
        return {
          success: false,
          error: 'Email inválido',
          action: 'signin' as const
        };
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', '),
          action: 'signin' as const
        };
      }

      // Primeiro tenta fazer login
      const signInResult = await signIn(email, password);
      if (signInResult.success) {
        return { ...signInResult, action: 'signin' as const };
      }

      // Se o login falhou, tenta criar a conta
      const signUpResult = await signUp(email, password, name);
      if (signUpResult.success) {
        return { ...signUpResult, action: 'signup' as const };
      }

      // Se o erro for que o usuário já existe, tenta fazer login novamente
      if (signUpResult.error?.includes('already registered')) {
        const retrySignIn = await signIn(email, password);
        return { ...retrySignIn, action: 'signin' as const };
      }

      return { ...signUpResult, action: 'signup' as const };
    } catch (error: any) {
      console.error('Error in signInOrSignUp:', error.message);
      return {
        success: false,
        error: error.message,
        action: 'signin' as const
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // Validate email
      if (!validateEmail(email)) {
        return {
          success: false,
          error: 'Email inválido'
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      await logSuspiciousActivity(null, 'password_reset_requested', { email });
      
      sonnerToast.success('Email enviado', {
        description: 'Verifique sua caixa de entrada para redefinir a senha.'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error requesting password reset:', error.message);
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      // Validate password strength
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      if (user) {
        await registerActivity(user.id, 'password_changed', { method: 'reset' });
      }
      
      sonnerToast.success('Senha atualizada', {
        description: 'Sua senha foi alterada com sucesso.'
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await registerActivity(user.id, 'logout', { method: 'manual' });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setProfile(null);
      sessionStartTime.current = 0;
      
      sonnerToast.success('Logout realizado', {
        description: 'Você foi desconectado com sucesso.'
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInOrSignUp,
      signInWithDiscord,
      signOut,
      refreshProfile,
      forgotPassword,
      resetPassword,
      isSessionValid,
      getSessionAge,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
