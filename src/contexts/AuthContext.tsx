
import React, { createContext, useState, useContext, useEffect } from 'react';
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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) {
      console.log('No user to refresh profile for');
      return;
    }
    
    try {
      console.log('Refreshing profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error loading user profile:', error);
        throw error;
      }
      
      console.log('Profile loaded successfully:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading user profile:', error.message);
      // Não mostrar toast aqui pois pode ser esperado que o perfil não exista ainda
    }
  };

  useEffect(() => {
    setLoading(true);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            // Load existing profile
            const { data: existingProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error && error.code === 'PGRST116') {
              // Profile doesn't exist, create it
              console.log('Creating profile for user:', currentSession.user.id);
              await createUserProfile(currentSession.user);
            } else if (existingProfile) {
              console.log('Profile loaded:', existingProfile);
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
    
    // Check for existing session with timeout
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            const { data: existingProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error && error.code === 'PGRST116') {
              console.log('Creating profile for existing session user:', currentSession.user.id);
              await createUserProfile(currentSession.user);
            } else if (existingProfile) {
              console.log('Profile loaded for existing session:', existingProfile);
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
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false');
      setLoading(false);
    }, 5000); // 5 seconds timeout
    
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
      console.log('Creating profile for user:', user.id);
      console.log('User metadata:', user.user_metadata);
      
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', selectError);
        throw selectError;
      }

      if (!existingProfile) {
        console.log('No existing profile found, creating new one...');
        
        // Determinar o nome do usuário baseado no provider
        let username = user.email?.split('@')[0] || 'Usuário';
        let avatarUrl = null;
        let fullName = null;
        
        if (user.user_metadata?.provider === 'discord') {
          username = user.user_metadata?.full_name || user.user_metadata?.username || username;
          avatarUrl = user.user_metadata?.avatar_url;
          fullName = user.user_metadata?.full_name;
          console.log('Discord user data:', { username, avatarUrl, fullName });
        } else if (user.user_metadata?.username) {
          username = user.user_metadata.username;
        }

        const profileData = {
          id: user.id,
          email: user.email,
          username: username,
          avatar_url: avatarUrl,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('Inserting profile data:', profileData);

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting profile:', insertError);
          throw insertError;
        }

        console.log('Profile created successfully:', newProfile);
        
        // Atualizar o estado do perfil
        setProfile(newProfile);
        
        // Registrar atividade de criação de perfil
        await registerActivity(user.id, 'profile_created', { profile_id: newProfile.id });
        
        toast({
          title: "Perfil criado com sucesso!",
          description: "Seu perfil foi configurado automaticamente.",
        });
      } else {
        console.log('Profile already exists:', existingProfile);
        
        // Se o perfil já existe, atualizar com dados do Discord se necessário
        if (user.user_metadata?.provider === 'discord' && !existingProfile.avatar_url) {
          console.log('Updating existing profile with Discord data...');
          
          const updateData = {
            avatar_url: user.user_metadata?.avatar_url,
            username: user.user_metadata?.full_name || user.user_metadata?.username || existingProfile.username,
            full_name: user.user_metadata?.full_name,
            updated_at: new Date().toISOString(),
          };

          console.log('Updating profile with:', updateData);

          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating profile:', updateError);
            throw updateError;
          }

          console.log('Profile updated successfully:', updatedProfile);
          
          // Atualizar o estado do perfil
          setProfile(updatedProfile);
          
          // Registrar atividade de atualização de perfil
          await registerActivity(user.id, 'profile_updated', { field: 'discord_data' });
        } else {
          // Se não precisar atualizar, apenas definir o perfil existente
          setProfile(existingProfile);
        }
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
    // Temporariamente desabilitado até os tipos serem atualizados
    console.log('Activity registered:', { userId, activityType, activityData });
  };

  const registerLoginStats = async (userId: string) => {
    // Temporariamente desabilitado até os tipos serem atualizados
    console.log('Login stats registered for user:', userId);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
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
      console.log('Starting Discord OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        console.error('Discord OAuth error:', error);
        throw error;
      }
      
      console.log('Discord OAuth URL generated:', data.url);
      
      // Se o redirecionamento foi bem-sucedido, mostrar mensagem
      if (data.url) {
        toast({
          title: "Redirecionando para Discord",
          description: "Aguarde enquanto você é redirecionado...",
        });
        
        // Redirecionar para Discord
        window.location.href = data.url;
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
          },
          emailRedirectTo: undefined, // Não redirecionar email
        },
      });
      
      if (error) throw error;
      
      sonnerToast.success('Registro bem-sucedido!', {
        description: 'Sua conta foi criada com sucesso.',
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
      // Primeiro tenta fazer login
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!signInError) {
        sonnerToast.success('Login bem-sucedido', {
          description: 'Bem-vindo de volta!'
        });
        return { success: true, action: 'signin' as const };
      }
      
      // Se o login falhou, tenta criar a conta
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
          },
          emailRedirectTo: undefined, // Não redirecionar email
        },
      });
      
      if (signUpError) {
        // Se o erro for que o usuário já existe, tenta fazer login novamente
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists') ||
            signUpError.message.includes('User already registered')) {
          
          const { error: retrySignInError } = await supabase.auth.signInWithPassword({ email, password });
          if (!retrySignInError) {
            sonnerToast.success('Login bem-sucedido', {
              description: 'Bem-vindo de volta!'
            });
            return { success: true, action: 'signin' as const };
          }
        }
        throw signUpError;
      }
      
      // Se chegou aqui, a conta foi criada com sucesso
      sonnerToast.success('Conta criada e login realizado!', {
        description: 'Bem-vindo! Sua conta foi criada automaticamente.',
      });
      
      return { success: true, action: 'signup' as const };
    } catch (error: any) {
      console.error('Error in signInOrSignUp:', error.message);
      toast({
        title: "Erro ao fazer login/criar conta",
        description: error.message,
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
        action: 'signin' as const,
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      sonnerToast.success('Email enviado', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      sonnerToast.success('Senha atualizada', {
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating password:', error.message);
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
      await supabase.auth.signOut();
      setProfile(null);
      sonnerToast.success('Logout realizado', {
        description: 'Até a próxima!',
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
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
