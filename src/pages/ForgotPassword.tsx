
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-xl">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-warning-purple/20 rounded-full filter blur-[80px] opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-warning-purple/20 rounded-full filter blur-[80px] opacity-50 -z-10"></div>
        
        <Link to="/" className="flex items-center text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o início
        </Link>
        
        <h2 className="font-display text-2xl font-bold mb-6 text-center text-gradient">
          {emailSent ? "Email enviado" : "Recuperar senha"}
        </h2>
        
        {emailSent ? (
          <div className="text-center space-y-4">
            <p className="text-white/80">
              Enviamos um link para redefinição de senha para o seu email. Por favor, verifique sua caixa de entrada.
            </p>
            <Button asChild className="w-full gradient-button hover-glow rounded-full py-6">
              <Link to="/">Voltar para o início</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-white/60 text-sm mb-6 text-center">
              Digite seu email e enviaremos instruções para redefinir sua senha.
            </p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              
              <Button 
                type="submit" 
                className="w-full gradient-button hover-glow rounded-full py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : "Enviar instruções"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
