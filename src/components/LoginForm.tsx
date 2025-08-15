
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signInOrSignUp, signInWithDiscord } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await signInOrSignUp(data.email, data.password, data.name);
      
      if (result.success) {
        onLogin(data.email, data.password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    setIsDiscordLoading(true);
    
    try {
      const result = await signInWithDiscord();
      
      if (result.success) {
        // O redirecionamento será feito automaticamente pelo Supabase
        toast({
          title: "Redirecionando para Discord",
          description: "Aguarde enquanto você é redirecionado...",
        });
      }
    } finally {
      setIsDiscordLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="w-full">
        <h2 className="font-display text-2xl font-bold mb-6 text-center text-gradient">
          Entrar ou criar conta
        </h2>
        <p className="text-center text-white/60 text-sm mb-6">
          Digite seus dados e entraremos automaticamente ou criaremos sua conta
        </p>
        
        {/* Discord Login Button */}
        <div className="mb-6">
          <Button
            type="button"
            onClick={handleDiscordLogin}
            disabled={isDiscordLoading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full py-6 mb-4 transition-colors"
          >
            {isDiscordLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            )}
            {isDiscordLoading ? "Conectando..." : "Continuar com Discord"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-white/40">ou</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                {...form.register("name")}
                type="text"
                placeholder="Nome completo"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                {...form.register("email")}
                type="email"
                placeholder="Email"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              <span className="text-white/70">Lembrar</span>
            </label>
            <Button variant="link" className="text-warning-purple hover:text-warning-purple-light p-0 h-auto" asChild>
              <Link to="/forgot-password">Esqueceu a senha?</Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <input id="terms" type="checkbox" className="rounded border-white/20 bg-white/5" />
            <label htmlFor="terms" className="text-white/70 text-sm">
              Eu concordo com os <a href="#" className="text-warning-purple hover:text-warning-purple-light">Termos de Serviço</a> e <a href="#" className="text-warning-purple hover:text-warning-purple-light">Política de Privacidade</a>
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-button hover-glow rounded-full py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : "Entrar ou Criar Conta"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
