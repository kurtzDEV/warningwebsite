import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Clock, 
  Shield, 
  Star, 
  TrendingUp, 
  Activity,
  Award,
  Zap,
  ShoppingCart,
  DollarSign,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";

const UserStats = () => {
  const { user, profile } = useAuth();
  const { getOrders } = useCart();
  const [stats, setStats] = useState({
    totalLogins: 0,
    lastLogin: new Date(),
    totalSessions: 0,
    totalDuration: 0,
    securityScore: 0,
    accountAge: 0,
    achievements: 0,
    rank: "Bronze",
    totalPurchases: 0,
    totalSpent: 0,
    totalProducts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadRecentActivities();
      loadRecentOrders();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Calcular idade da conta
      const accountAge = user?.created_at ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      // Carregar estatísticas do banco de dados
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error loading user stats:', statsError);
      }

      // Carregar produtos do usuário
      const { data: userProducts, error: productsError } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (productsError) {
        console.error('Error loading user products:', productsError);
      }

      // Usar dados do banco ou dados simulados
      const totalLogins = userStats?.total_logins || Math.max(1, Math.floor(accountAge * 0.8));
      const totalSessions = userStats?.total_sessions || Math.max(1, Math.floor(accountAge * 0.8));
      const totalDuration = userStats?.total_duration_minutes || Math.max(30, Math.floor(accountAge * 45));
      const lastLogin = userStats?.last_login ? new Date(userStats.last_login) : new Date();
      const totalPurchases = userStats?.total_purchases || 0;
      const totalSpent = userStats?.total_spent || 0;
      const totalProducts = userProducts?.length || 0;
      
      // Calcular score de segurança baseado em vários fatores
      let securityScore = 50; // Base
      if (user.email) securityScore += 10;
      if (user.user_metadata?.provider === 'discord') securityScore += 15;
      if (profile?.avatar_url) securityScore += 5;
      if (accountAge > 7) securityScore += 10;
      if (totalLogins > 5) securityScore += 10;
      if (totalPurchases > 0) securityScore += 10;
      
      // Calcular rank baseado em atividade e compras
      let rank = "Bronze";
      const activityScore = totalLogins + (totalPurchases * 5) + (totalProducts * 3);
      if (activityScore >= 100) rank = "Diamante";
      else if (activityScore >= 70) rank = "Platina";
      else if (activityScore >= 50) rank = "Ouro";
      else if (activityScore >= 30) rank = "Prata";
      
      // Calcular conquistas baseadas em atividade
      let achievements = 0;
      if (totalLogins >= 1) achievements++;
      if (totalLogins >= 5) achievements++;
      if (totalLogins >= 10) achievements++;
      if (totalLogins >= 20) achievements++;
      if (accountAge >= 7) achievements++;
      if (accountAge >= 30) achievements++;
      if (totalDuration >= 60) achievements++;
      if (totalDuration >= 300) achievements++;
      if (totalPurchases >= 1) achievements++;
      if (totalPurchases >= 3) achievements++;
      if (totalProducts >= 1) achievements++;
      if (totalProducts >= 5) achievements++;

      setStats({
        totalLogins,
        lastLogin,
        totalSessions,
        totalDuration,
        securityScore: Math.min(securityScore, 100),
        accountAge,
        achievements,
        rank,
        totalPurchases,
        totalSpent,
        totalProducts
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading activities:', error);
        setRecentActivities([
          { type: "login", description: "Login realizado", time: "Agora" }
        ]);
        return;
      }

      const formattedActivities = activities.map(activity => ({
        type: activity.activity_type,
        description: getActivityDescription(activity.activity_type),
        time: formatTimeAgo(new Date(activity.created_at)),
        data: activity.activity_data
      }));

      setRecentActivities(formattedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setRecentActivities([
        { type: "login", description: "Login realizado", time: "Agora" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const orders = await getOrders();
      setRecentOrders(orders.slice(0, 3));
    } catch (error) {
      console.error('Error loading orders:', error);
      setRecentOrders([]);
    }
  };

  const getActivityDescription = (type: string) => {
    switch (type) {
      case "login": return "Login realizado";
      case "logout": return "Logout realizado";
      case "profile_update": return "Perfil atualizado";
      case "avatar_update": return "Avatar alterado";
      case "security_update": return "Configurações de segurança alteradas";
      case "purchase_initiated": return "Compra iniciada";
      case "purchase": return "Compra realizada";
      case "profile_created": return "Perfil criado";
      default: return "Atividade realizada";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes} minutos atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} horas atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} semanas atrás`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return <Activity className="h-4 w-4" />;
      case "profile": return <Shield className="h-4 w-4" />;
      case "security": return <Zap className="h-4 w-4" />;
      case "product": return <Award className="h-4 w-4" />;
      case "purchase": return <ShoppingCart className="h-4 w-4" />;
      case "purchase_initiated": return <ShoppingCart className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Bronze": return "bg-orange-500/20 text-orange-400";
      case "Prata": return "bg-gray-500/20 text-gray-400";
      case "Ouro": return "bg-yellow-500/20 text-yellow-400";
      case "Platina": return "bg-blue-500/20 text-blue-400";
      case "Diamante": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Estatísticas Principais */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-warning-purple" />
            Estatísticas Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalLogins}</div>
              <div className="text-xs text-white/60">Total de Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
              <div className="text-xs text-white/60">Sessões Ativas</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
            </div>
            <div className="text-xs text-white/60">Tempo Total Online</div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning-purple" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Membro desde</span>
            <span className="text-white text-sm">
              {user?.created_at ? format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR }) : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Dias de conta</span>
            <span className="text-white text-sm">{stats.accountAge} dias</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Último login</span>
            <span className="text-white text-sm">
              {format(stats.lastLogin, "dd/MM HH:mm", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Rank</span>
            <Badge className={getRankColor(stats.rank)}>
              {stats.rank}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Compras e Produtos */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-warning-purple" />
            Compras e Produtos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalPurchases}</div>
              <div className="text-xs text-white/60">Compras Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              <div className="text-xs text-white/60">Produtos Ativos</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              <span className="mr-1">🇧🇷</span>
              R$ {stats.totalSpent.toFixed(2)}
            </div>
            <div className="text-xs text-white/60">Total Gasto</div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning-purple" />
            Segurança da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Score de Segurança</span>
              <span className="text-white text-sm">{stats.securityScore}%</span>
            </div>
            <Progress value={stats.securityScore} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-white/80 text-sm">Autenticação 2FA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-white/80 text-sm">Email verificado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-white/80 text-sm">Senha forte</span>
            </div>
            {stats.totalPurchases > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-white/80 text-sm">Cliente verificado</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-warning-purple" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.achievements}</div>
            <div className="text-sm text-white/60">Conquistas Desbloqueadas</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < stats.achievements 
                  ? 'bg-warning-purple/20' 
                  : 'bg-white/5'
              }`}>
                <Star className={`h-4 w-4 ${
                  i < stats.achievements 
                    ? 'text-warning-purple' 
                    : 'text-white/20'
                }`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pedidos Recentes */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-warning-purple" />
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="text-warning-purple">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{order.orderNumber}</div>
                    <div className="text-white/50 text-xs">
                      R$ {order.totalAmount.toFixed(2)} • {order.status}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-warning-purple border-warning-purple">
                    {order.paymentStatus}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Nenhum pedido encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-warning-purple" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="text-warning-purple">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">{activity.description}</div>
                  <div className="text-white/50 text-xs">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
