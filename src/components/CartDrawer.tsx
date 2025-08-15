
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ArrowRight,
  CreditCard,
  QrCode,
  Trash2
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import QRCodeModal from './QRCodeModal';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalItems, 
    totalPrice, 
    clearCart,
    currentOrder,
    setCurrentOrder
  } = useCart();
  const { toast } = useToast();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Criar pedido simulado
      const order = {
        id: `order-${Date.now()}`,
        orderNumber: `WB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        totalAmount: totalPrice,
        items: items,
        qrCodeData: JSON.stringify({
          merchantName: "Warning Bypass",
          merchantCity: "SAO PAULO",
          postalCode: "01000-000",
          amount: totalPrice,
          transactionId: `WB-${Date.now()}`,
          description: "Warning Bypass - Produto Digital"
        }),
        discordLink: 'https://discord.gg/warningbypass'
      };

      setCurrentOrder(order);
      setQrModalOpen(true);
      onOpenChange(false);

      toast({
        title: "Pedido criado!",
        description: "Escaneie o QR Code para finalizar o pagamento.",
      });

    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirmed = () => {
    setQrModalOpen(false);
    clearCart();
    setCurrentOrder(null);
    
    toast({
      title: "Compra finalizada!",
      description: "Obrigado por comprar o Warning Bypass!",
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    clearCart();
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos.",
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="border-l border-warning-purple/20 bg-black/95 backdrop-blur-lg w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-gradient font-display text-xl flex items-center justify-between">
              <span>Seu Carrinho</span>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <ShoppingBag className="w-16 h-16 text-warning-purple/50 mb-4" />
              <h3 className="text-white/70 text-lg">Seu carrinho está vazio</h3>
              <p className="text-white/50 text-sm mt-2 mb-6">Adicione alguns produtos para continuar</p>
              <Button 
                onClick={() => onOpenChange(false)}
                className="glass-card px-6"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="my-6 flex flex-col space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <CartItemCard 
                    key={item.id} 
                    item={item} 
                    onRemove={removeItem} 
                    onUpdateQuantity={updateQuantity} 
                  />
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 border-t border-warning-purple/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white font-semibold">
                    <span className="mr-1">🇧🇷</span>
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full gradient-button hover-glow rounded-full py-6 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-5 w-5" />
                      Pagar com PIX
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        orderData={currentOrder ? {
          orderNumber: currentOrder.orderNumber,
          totalAmount: currentOrder.totalAmount,
          items: currentOrder.items,
          qrCodeData: currentOrder.qrCodeData,
          discordLink: currentOrder.discordLink
        } : null}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItemCard = ({ item, onRemove, onUpdateQuantity }: CartItemCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      onRemove(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 glass-card p-3 rounded-lg">
      <div className="w-16 h-16 rounded-md bg-warning-purple/10 overflow-hidden flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-10 h-10 object-contain" />
        ) : (
          <ShoppingBag className="w-8 h-8 text-warning-purple" />
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="text-white text-sm font-medium">{item.title}</h4>
        <p className="text-warning-purple font-bold">
          <span className="mr-1">🇧🇷</span>
          R$ {item.price.toFixed(2)}
        </p>
        <p className="text-white/50 text-xs">
          Total: R$ {(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-warning-purple/10 text-warning-purple hover:bg-warning-purple/30"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isUpdating}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-warning-purple/10 text-warning-purple hover:bg-warning-purple/30"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/30 mx-auto"
          onClick={handleRemove}
          disabled={isUpdating}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartDrawer;
