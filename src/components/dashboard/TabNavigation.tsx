
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemStats from "./SystemStats";
import LicenseInfo from "./LicenseInfo";
import OrderHistory from "./OrderHistory";
import ProductsSection from "./ProductsSection";
import SubscriptionSection from "./SubscriptionSection";
import SecuritySection from "./SecuritySection";
import SettingsSection from "./SettingsSection";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: {
    name: string;
    email: string;
    memberSince: string;
    subscriptionStatus: string;
    subscriptionType: string;
    nextBilling: string;
    licenseKey: string;
  };
  orderHistory: {
    id: string;
    date: string;
    product: string;
    price: number;
    status: string;
  }[];
}

const TabNavigation = ({
  activeTab,
  setActiveTab,
  userData,
  orderHistory
}: TabNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="glass-card mb-6 grid grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="products">Produtos</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
        <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <SystemStats />
        <LicenseInfo userData={userData} />
        <OrderHistory 
          orders={orderHistory} 
          compact={true} 
          showViewAll={true}
          onViewAll={() => setActiveTab("history")}
        />
      </TabsContent>
      
      <TabsContent value="products">
        <ProductsSection />
      </TabsContent>
      
      <TabsContent value="history">
        <OrderHistory orders={orderHistory} />
      </TabsContent>
      
      <TabsContent value="subscription">
        <SubscriptionSection userData={userData} />
      </TabsContent>
      
      <TabsContent value="security">
        <SecuritySection />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsSection userData={userData} />
      </TabsContent>
    </Tabs>
  );
};

export default TabNavigation;
