import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  QrCode, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  Clock,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Download,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/contexts/CartContext';

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    orderNumber: string;
    totalAmount: number;
    items: CartItem[];
    qrCodeData: string;
    discordLink: string;
  } | null;
  onPaymentConfirmed: () => void;
}

const QRCodeModal = ({ open, onOpenChange, orderData, onPaymentConfirmed }: QRCodeModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'expired'>('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos
  const { toast } = useToast();

  useEffect(() => {
    if (open && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, timeLeft]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Código PIX copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const openDiscordLink = () => {
    window.open('https://discord.gg/warningbypass', '_blank');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePaymentConfirmed = () => {
    setPaymentStatus('confirmed');
    onPaymentConfirmed();
    toast({
      title: "Pagamento confirmado!",
      description: "Redirecionando para o Discord...",
    });
    
    setTimeout(() => {
      openDiscordLink();
    }, 2000);
  };

  if (!orderData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black/95 backdrop-blur-lg border-warning-purple/20">
        <DialogHeader>
          <DialogTitle className="text-gradient font-display text-2xl flex items-center gap-3">
            <div className="p-2 bg-warning-purple/20 rounded-lg">
              <QrCode className="h-6 w-6 text-warning-purple" />
            </div>
            Pagamento via PIX
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Informações do Pedido */}
          <div className="space-y-6">
            {/* Status do Pedido */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70 text-sm font-medium">Número do Pedido</span>
                <Badge variant="outline" className="text-warning-purple border-warning-purple font-mono text-xs">
                  {orderData.orderNumber}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70 text-sm font-medium">Valor Total</span>
                <span className="text-white font-bold text-2xl">
                  <span className="mr-2">🇧🇷</span>
                  R$ {orderData.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">Status do Pagamento</span>
                <div className="flex items-center gap-2">
                  {paymentStatus === 'pending' && (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-500 text-sm font-medium">Aguardando</span>
                    </>
                  )}
                  {paymentStatus === 'confirmed' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm font-medium">Confirmado</span>
                    </>
                  )}
                  {paymentStatus === 'expired' && (
                    <>
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-red-500 text-sm font-medium">Expirado</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Timer */}
            {paymentStatus === 'pending' && (
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="text-white/70 text-sm mb-3 font-medium">⏰ Tempo restante para pagamento</div>
                <div className="text-4xl font-mono font-bold text-warning-purple mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/50 text-xs">
                  Após este tempo, o pedido será cancelado automaticamente
                </div>
              </div>
            )}

            {/* Instruções */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Smartphone className="h-5 w-5 text-warning-purple mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-2">📱 Como pagar</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-warning-purple/20 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Abra seu app bancário</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-warning-purple/20 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Escaneie o QR Code ao lado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-warning-purple/20 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Confirme o pagamento</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - QR Code */}
          <div className="space-y-6">
            {/* QR Code Section */}
            {paymentStatus === 'pending' && (
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="text-white/70 text-sm mb-6 font-medium">
                  📱 Escaneie o QR Code com seu app bancário
                </div>
                
                {/* QR Code Real - Imagem PNG */}
                <div className="bg-white p-8 rounded-xl inline-block mb-6 relative">
                  <div className="w-64 h-64 relative">
                    <img 
                      src="/qrcode-pix.png" 
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(orderData.qrCodeData)}
                    className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar PIX
                  </Button>
                </div>
              </div>
            )}

            {/* Status de Confirmação */}
            {paymentStatus === 'confirmed' && (
              <div className="glass-card p-8 rounded-xl text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  Seu pedido foi processado com sucesso.
                </p>
                <Button
                  onClick={openDiscordLink}
                  className="gradient-button hover-glow w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar Discord
                </Button>
              </div>
            )}

            {/* Status Expirado */}
            {paymentStatus === 'expired' && (
              <div className="glass-card p-8 rounded-xl text-center">
                <Clock className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Tempo Expirado
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  O tempo para pagamento expirou. Tente novamente.
                </p>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="gradient-button hover-glow w-full"
                >
                  Fechar
                </Button>
              </div>
            )}

            {/* Botão de Simulação (apenas para desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && paymentStatus === 'pending' && (
              <div className="glass-card p-4 rounded-xl">
                <div className="text-white/70 text-sm mb-3 text-center">
                  🧪 Modo Desenvolvimento
                </div>
                <Button
                  onClick={handlePaymentConfirmed}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Simular Pagamento
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-warning-purple/20 my-6" />

        {/* Informações Importantes */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-warning-purple mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-2">⚠️ Informação Importante</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Após realizar o pagamento, você <strong>deve enviar o comprovante</strong> no nosso Discord para receber seu produto.
              </p>
            </div>
          </div>
          
          <div className="bg-warning-purple/10 border border-warning-purple/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-warning-purple" />
              <span className="text-warning-purple font-medium text-sm">Próximo Passo</span>
            </div>
            <p className="text-white/80 text-sm">
              1. Faça o pagamento via PIX<br/>
              2. Tire um print do comprovante<br/>
              3. Acesse nosso Discord: <strong>discord.gg/warningbypass</strong><br/>
              4. Envie o comprovante para receber seu produto
            </p>
          </div>

          <Button
            variant="outline"
            onClick={openDiscordLink}
            className="w-full text-warning-purple border-warning-purple hover:bg-warning-purple/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Acessar Discord Agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
