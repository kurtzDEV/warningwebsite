
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfile from "@/components/dashboard/UserProfile";
import ProtectionSystem from "@/components/dashboard/ProtectionSystem";
import TabNavigation from "@/components/dashboard/TabNavigation";
import SystemStats from "@/components/dashboard/SystemStats";
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useAuth();

  // Dados simulados para pedidos
  const orderHistory = [
    { id: "ORD-2025-001", date: "10/04/2025", product: "FiveM Pro", price: 49.99, status: "Concluído", currency: "BRL" },
    { id: "ORD-2025-002", date: "05/04/2025", product: "FiveM Enterprise (Anual)", price: 899.99, status: "Processando", currency: "USD" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="container px-4 mx-auto pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <UserProfile 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <ProtectionSystem />
          </div>
          
          <div className="lg:w-3/4">
            <TabNavigation 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userData={{
                name: profile?.username || "Usuário",
                email: profile?.email || "usuario@exemplo.com",
                memberSince: "Abril 2025",
                subscriptionStatus: profile?.subscription_status || "Ativo",
                subscriptionType: profile?.subscription_type || "FiveM Pro",
                nextBilling: profile?.next_billing || "12/05/2025",
                licenseKey: profile?.license_key || "WB-XXXX-XXXX-XXXX-XXXX",
              }}
              systemStats={[]} // Removido pois agora usamos o componente SystemStats
              orderHistory={orderHistory}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
