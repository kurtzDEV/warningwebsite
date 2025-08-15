
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionSectionProps {
  userData: {
    subscriptionType: string;
  };
}

const SubscriptionSection = ({ userData }: SubscriptionSectionProps) => {
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  
  // Price mapping based on currency
  const prices = {
    "FiveM Basic": { BRL: 50.00, USD: 10.00 },
    "FiveM Pro": { BRL: 120.00, USD: 24.00 },
    "FiveM Enterprise": { BRL: 200.00, USD: 40.00 }
  };
  
  // Get current subscription price based on the user's plan and selected currency
  const getCurrentPrice = () => {
    const planKey = userData.subscriptionType as keyof typeof prices;
    if (prices[planKey]) {
      return prices[planKey][currency];
    }
    return currency === "BRL" ? 120.00 : 24.00; // Default to Pro price
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6 text-gradient">Gerenciar Assinatura</h3>
      <p className="text-white/60 mb-6">Sua assinatura atual é {userData.subscriptionType}</p>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="glass p-4 rounded-lg flex-1">
          <p className="text-white/60 mb-1">Moeda</p>
          <Select value={currency} onValueChange={(value) => setCurrency(value as "BRL" | "USD")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">🇧🇷 BRL (R$)</SelectItem>
              <SelectItem value="USD">🇺🇸 USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 mb-1">Valor</p>
          <p className="text-white font-bold">
            <span className="mr-1">{currency === "BRL" ? "🇧🇷" : "🇺🇸"}</span>
            {currency === "BRL" ? "R$" : "$"} {getCurrentPrice().toFixed(2)}/{currency === "BRL" ? "mês" : "month"}
          </p>
        </div>
        <Button 
          className="gradient-button rounded-full"
          onClick={() => window.open('https://discord.gg/warningbypass', '_blank')}
        >
          Solicitar Suporte
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSection;
