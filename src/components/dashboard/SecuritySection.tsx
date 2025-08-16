
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

const SecuritySection = () => {
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryKeys, setRecoveryKeys] = useState<string[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSetup2FA = () => {
    setTwoFactorDialogOpen(true);
  };

  const handleContinueSetup = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (setupStep === 1) {
        // Simular geração de chaves de recuperação
        setRecoveryKeys([
          "ABCD-EFGH-IJKL-MNOP",
          "QRST-UVWX-YZAB-CDEF",
          "GHIJ-KLMN-OPQR-STUV",
          "WXYZ-1234-5678-9012"
        ]);
        setSetupStep(2);
      } else {
        if (verificationCode === "123456") {
          setTwoFactorDialogOpen(false);
          setSetupStep(1);
          setVerificationCode("");
          sonnerToast.success("2FA Ativado", {
            description: "A verificação em duas etapas foi ativada com sucesso."
          });
        } else {
          toast({
            title: "Código inválido",
            description: "O código inserido não é válido.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      toast({
        title: "Erro na configuração",
        description: "Ocorreu um erro ao configurar a verificação em duas etapas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRecoveryKeys = () => {
    navigator.clipboard.writeText(recoveryKeys.join("\n"));
    sonnerToast.success("Copiado", {
      description: "Chaves de recuperação copiadas para a área de transferência."
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setChangePasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      sonnerToast.success("Senha alterada", {
        description: "Sua senha foi alterada com sucesso."
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro ao alterar sua senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6 text-gradient">Segurança da Conta</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Verificação em duas etapas</h4>
                <p className="text-white/60 text-sm">Adicione uma camada extra de segurança à sua conta</p>
              </div>
              <Button 
                variant="outline" 
                className="bg-transparent border border-warning-purple/30"
                onClick={handleSetup2FA}
              >
                Configurar
              </Button>
            </div>
          </div>
          
          <Separator className="bg-white/5" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Alterar senha</h4>
                <p className="text-white/60 text-sm">Mantenha sua conta segura com uma senha forte</p>
              </div>
              <Button 
                variant="outline" 
                className="bg-transparent border border-warning-purple/30"
                onClick={() => setChangePasswordDialogOpen(true)}
              >
                Alterar
              </Button>
            </div>
          </div>
          
          <Separator className="bg-white/5" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Sessões ativas</h4>
                <p className="text-white/60 text-sm">Gerenciar dispositivos conectados à sua conta</p>
              </div>
              <Button variant="outline" className="bg-transparent border border-warning-purple/30">
                Visualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para 2FA */}
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent className="glass-card border-0 overflow-hidden w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">
              Configurar verificação em duas etapas
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {setupStep === 1 
                ? "Escaneie o código QR com seu aplicativo de autenticação" 
                : "Verifique seu código e guarde suas chaves de recuperação"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {setupStep === 1 ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-48 h-48 bg-white p-2 rounded">
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/WarningBypass:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=WarningBypass" 
                      alt="QR Code" 
                      className="w-40 h-40 object-contain" 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white/80 mb-2">Código secreto:</p>
                  <div className="flex items-center space-x-2 justify-center">
                    <code className="bg-black/50 px-3 py-1.5 rounded font-mono text-warning-purple">
                      JBSWY3DPEHPK3PXP
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        navigator.clipboard.writeText("JBSWY3DPEHPK3PXP");
                        sonnerToast.success("Copiado", { description: "Código copiado para a área de transferência" });
                      }}
                    >
                      <Copy className="h-4 w-4 text-white/60" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-white/80 block mb-2">
                    Digite o código de verificação:
                  </label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Digite o código de 6 dígitos do seu aplicativo de autenticação
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-white/80">Chaves de recuperação:</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={handleCopyRecoveryKeys}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copiar
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {recoveryKeys.map((key, index) => (
                      <div 
                        key={index} 
                        className="bg-black/30 px-2 py-1 rounded text-center font-mono text-xs text-warning-purple"
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    Guarde estas chaves em um lugar seguro para recuperar sua conta
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="gradient-button hover-glow rounded-full"
              onClick={handleContinueSetup}
              disabled={isLoading || (setupStep === 2 && verificationCode.length !== 6)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : setupStep === 1 ? "Continuar" : "Finalizar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para alterar senha */}
      <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
        <DialogContent className="glass-card border-0 overflow-hidden w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">
              Alterar senha
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Atualize sua senha para manter sua conta segura
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-white/80 block mb-2">
                Senha atual:
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/80 block mb-2">
                Nova senha:
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/80 block mb-2">
                Confirmar nova senha:
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="gradient-button hover-glow rounded-full"
              onClick={handleChangePassword}
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecuritySection;
