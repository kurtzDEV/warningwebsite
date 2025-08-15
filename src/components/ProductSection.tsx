
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Shield, Cpu, Server, Crown, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const products = [
  {
    id: "public-bypass",
    title: "Public Bypass",
    description: "Bypass público para uso geral",
    image: "/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png",
    features: [
      "Bypass público",
      "Acesso a servidores públicos",
      "Atualizações mensais",
      "Suporte básico",
      "1 dispositivo"
    ],
    popular: false,
    currency: "BRL" as const,
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: "private-bypass",
    title: "Private Bypass",
    description: "Bypass privado com recursos avançados",
    image: "/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png",
    features: [
      "Bypass privado",
      "Acesso a servidores privados",
      "Atualizações mensais",
      "Suporte prioritário",
      "2 dispositivos",
      "Anti-detecção avançado"
    ],
    popular: true,
    currency: "BRL" as const,
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: "exclusive-bypass",
    title: "Exclusive Bypass",
    description: "Price Infinity key - Acesso vitalício",
    image: "/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png",
    features: [
      "Bypass exclusivo vitalício",
      "Acesso a todos os servidores",
      "Atualizações vitalícias",
      "Suporte VIP 24/7",
      "Dispositivos ilimitados",
      "Anti-detecção premium",
      "Acesso antecipado a recursos",
      "Sistema anti-ban avançado"
    ],
    popular: false,
    currency: "BRL" as const,
    icon: <Crown className="h-6 w-6" />
  }
];

const periods = [
  { id: "mensal", label: "Mensal" },
  { id: "trimestral", label: "Trimestral" },
  { id: "lifetime", label: "Lifetime" }
];

const ProductSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("mensal");

  const getPriceForPeriod = (planId: string, period: string) => {
    // Preços específicos para cada plano e período
    const priceMap: { [key: string]: { [key: string]: number } } = {
      "public-bypass": {
        "mensal": 90.00,
        "trimestral": 250.00,
        "lifetime": 1000.00
      },
      "private-bypass": {
        "mensal": 150.00,
        "trimestral": 400.00,
        "lifetime": 1000.00
      },
      "exclusive-bypass": {
        "mensal": 1000.00,
        "trimestral": 1000.00,
        "lifetime": 1000.00
      }
    };
    
    return priceMap[planId]?.[period] || 0;
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'mensal':
        return '/mês';
      case 'trimestral':
        return '/trimestre';
      case 'lifetime':
        return ' (Vitalício)';
      default:
        return '/mês';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('products');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-warning-purple/20 rounded-full filter blur-[100px] opacity-40"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
          <h2 className="font-display text-4xl font-bold mb-4 text-gradient">
            Nossos Produtos
          </h2>
          <p className="text-lg text-white/70">
            Escolha o plano que melhor se adapta às suas necessidades e eleve sua experiência de jogo com o melhor bypass do mercado.
          </p>
        </div>

        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-3 glass-card">
              {periods.map((period) => (
                <TabsTrigger 
                  key={period.id}
                  value={period.id}
                  className="data-[state=active]:bg-warning-purple/20 data-[state=active]:text-warning-purple"
                >
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {periods.map((period) => (
            <TabsContent key={period.id} value={period.id} className="mt-0">
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'}`}>
                {products.map((product, index) => {
                  const price = getPriceForPeriod(product.id, period.id);
                  const isLifetime = period.id === "lifetime";
                  
                  // For lifetime period, only show exclusive-bypass, hide others
                  if (period.id === "lifetime" && product.id !== "exclusive-bypass") {
                    return null;
                  }
                  
                  return (
                    <div 
                      key={`${product.id}-${period.id}`}
                      className="transition-all duration-700"
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <ProductCard 
                        {...product} 
                        price={price}
                        period={period.label}
                        isLifetime={isLifetime}
                        showSavings={period.id === "trimestral"}
                        savingsAmount={period.id === "trimestral" ? (getPriceForPeriod(product.id, "mensal") * 3 - price) : 0}
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className={`mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'}`}>
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-warning-purple" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">Anti-Detecção Avançada</h3>
            <p className="text-white/70 text-sm">Nossa tecnologia proprietária garante que você nunca será detectado pelos sistemas anti-cheat mais avançados.</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6 text-warning-purple" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">Desempenho Otimizado</h3>
            <p className="text-white/70 text-sm">Nosso bypass é extremamente leve e não afeta o desempenho do seu jogo, garantindo a melhor experiência possível.</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-4">
              <Server className="h-6 w-6 text-warning-purple" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">Acesso a Todos Servidores</h3>
            <p className="text-white/70 text-sm">Com o Warning Bypass, você pode acessar qualquer servidor, independentemente das proteções implementadas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
