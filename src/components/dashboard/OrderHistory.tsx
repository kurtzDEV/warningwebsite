
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Download,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const OrderHistory = () => {
  const { getOrders } = useCart();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 'completed':
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'cancelled':
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'pending':
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 'failed':
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const openDiscordLink = (discordLink: string) => {
    window.open(discordLink || 'https://discord.gg/warningbypass', '_blank');
  };

  const downloadInvoice = (order: any) => {
    // Simular download de invoice (em produção, seria gerado um PDF real)
    const invoiceData = {
      orderNumber: order.orderNumber,
      date: format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      total: order.totalAmount,
      items: order.items,
      status: order.status
    };
    
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.orderNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Invoice baixado",
      description: "O arquivo foi salvo no seu dispositivo.",
    });
  };

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-warning-purple" />
            Histórico de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Package className="h-5 w-5 text-warning-purple" />
          Histórico de Pedidos
        </CardTitle>
        <CardDescription className="text-white/60">
          Acompanhe todos os seus pedidos e status de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/70 text-lg mb-2">Nenhum pedido encontrado</h3>
            <p className="text-white/50 text-sm mb-6">
              Você ainda não fez nenhuma compra. Que tal começar agora?
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="gradient-button hover-glow"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ver Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass-card p-4 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h4 className="text-white font-medium">{order.orderNumber}</h4>
                      <p className="text-white/60 text-sm">
                        {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status === 'pending' && 'Pendente'}
                      {order.status === 'completed' && 'Concluído'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus === 'paid' && 'Pago'}
                      {order.paymentStatus === 'pending' && 'Aguardando'}
                      {order.paymentStatus === 'failed' && 'Falhou'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-warning-purple/20 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-warning-purple" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{item.title}</p>
                          <p className="text-white/60 text-xs">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-white/60 text-xs">
                          R$ {item.price.toFixed(2)} cada
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Total</p>
                    <p className="text-white text-lg font-bold">
                      <span className="mr-1">🇧🇷</span>
                      R$ {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {order.status === 'completed' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDiscordLink(order.discordLink)}
                          className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Discord
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(order)}
                          className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
