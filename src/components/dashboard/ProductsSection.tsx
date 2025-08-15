
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Download, 
  ExternalLink, 
  Key, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ProductsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProducts();
    }
  }, [user]);

  const loadUserProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case 'expired':
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 'suspended':
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'digital':
        return <Download className="h-5 w-5" />;
      case 'license':
        return <Key className="h-5 w-5" />;
      case 'subscription':
        return <Package className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const copyLicenseKey = async (licenseKey: string) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      toast({
        title: "Chave copiada!",
        description: "A chave de licença foi copiada para a área de transferência.",
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

  const downloadProduct = (product: any) => {
    // Simular download do produto (em produção, seria um arquivo real)
    const productData = {
      name: product.product_name,
      type: product.product_type,
      licenseKey: product.license_key,
      purchasedAt: product.purchased_at,
      instructions: "Acesse o Discord para obter suporte e instruções de uso."
    };
    
    const blob = new Blob([JSON.stringify(productData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.product_name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Produto baixado",
      description: "As informações do produto foram salvas.",
    });
  };

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-warning-purple" />
            Meus Produtos
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
          Meus Produtos
        </CardTitle>
        <CardDescription className="text-white/60">
          Gerencie seus produtos e licenças adquiridas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/70 text-lg mb-2">Nenhum produto encontrado</h3>
            <p className="text-white/50 text-sm mb-6">
              Você ainda não adquiriu nenhum produto. Que tal fazer sua primeira compra?
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="gradient-button hover-glow"
            >
              <Package className="h-4 w-4 mr-2" />
              Ver Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="glass-card p-4 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning-purple/20 rounded-lg flex items-center justify-center">
                      {getProductIcon(product.product_type)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{product.product_name}</h4>
                      <p className="text-white/60 text-sm capitalize">
                        {product.product_type}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {getStatusIcon(product.status)}
                    <span className="ml-1">
                      {product.status === 'active' && 'Ativo'}
                      {product.status === 'expired' && 'Expirado'}
                      {product.status === 'suspended' && 'Suspenso'}
                    </span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Comprado em</span>
                      <span className="text-white text-sm">
                        {format(new Date(product.purchased_at), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {product.expires_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Expira em</span>
                        <span className="text-white text-sm">
                          {format(new Date(product.expires_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {product.license_key && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Chave de Licença</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLicenseKey(product.license_key)}
                          className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                        >
                          <Key className="h-3 w-3 mr-1" />
                          Copiar
                        </Button>
                      </div>
                      <div className="bg-white/5 p-2 rounded text-xs font-mono text-white/80 break-all">
                        {product.license_key}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadProduct(product)}
                      className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openDiscordLink}
                      className="text-warning-purple border-warning-purple hover:bg-warning-purple/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Suporte
                    </Button>
                  </div>
                  
                  {product.status === 'active' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Disponível
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsSection;
