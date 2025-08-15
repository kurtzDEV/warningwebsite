import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Info, Star, CheckCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  image?: string;
  currency?: 'BRL' | 'USD';
  period?: string;
  isLifetime?: boolean;
  showSavings?: boolean;
  savingsAmount?: number;
}

const ProductCard = ({
  id,
  title,
  description,
  price,
  features,
  popular = false,
  image,
  currency = 'BRL',
  period = 'Mensal',
  isLifetime = false,
  showSavings = false,
  savingsAmount = 0
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const getConvertedPrice = () => {
    if (currency === 'USD') {
      return price / 5;
    }
    return price;
  }

  const handleAddToCart = async () => {
    try {
      addItem({ 
        id, 
        title: `${title} (${period})`, 
        price: getConvertedPrice(), 
        image 
      });
      
      toast({
        title: "Produto adicionado!",
        description: `${title} (${period}) foi adicionado ao seu carrinho.`,
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erro ao adicionar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const currencySymbol = currency === 'BRL' ? 'R$' : '$';
  const flagEmoji = currency === 'BRL' ? '🇧🇷' : '🇺🇸';
  const displayPrice = getConvertedPrice();

  const getPeriodText = () => {
    switch (period) {
      case 'Mensal':
        return '/mês';
      case 'Trimestral':
        return '/trimestre';
      case 'Lifetime':
        return ' (Vitalício)';
      default:
        return '/mês';
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-500 border-0 glass-card",
        popular ? "scale-105 z-10" : "",
        isHovered ? "transform-gpu -translate-y-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ zIndex: 1 }}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-warning-purple text-white text-xs font-bold uppercase py-1 px-3 rounded-bl-lg">
            Popular
          </div>
        </div>
      )}

      {isLifetime && (
        <div className="absolute top-0 left-0">
          <div className="bg-yellow-500 text-black text-xs font-bold uppercase py-1 px-3 rounded-br-lg">
            <Crown className="h-3 w-3 inline mr-1" />
            Lifetime
          </div>
        </div>
      )}

      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-warning-purple/5 via-transparent to-warning-purple/10 opacity-0 transition-opacity duration-500",
        isHovered ? "opacity-100" : ""
      )} style={{ zIndex: 0, pointerEvents: 'none' }} />

      <CardHeader>
        {image && (
          <div className="flex justify-center mb-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center bg-warning-purple/20 transition-all duration-500",
              isHovered ? "animate-pulse-glow" : ""
            )}>
              <img src={image} alt={title} className="w-8 h-8" />
            </div>
          </div>
        )}
        <CardTitle className="text-center font-display text-xl mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-white/60">
          {description}
        </CardDescription>
        {period && (
          <div className="text-center">
            <span className="inline-block bg-warning-purple/20 text-warning-purple text-xs font-medium px-2 py-1 rounded-full">
              {period}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
                                     <p className="text-3xl font-display font-bold text-white">
                             <span className="text-sm font-normal text-white/60 mr-1">
                               <span className="mr-1">{flagEmoji}</span>
                               {currencySymbol}
                             </span>
                             {displayPrice.toFixed(2)}
                             <span className="text-sm font-normal text-white/60 ml-1">{getPeriodText()}</span>
                           </p>
                           {showSavings && (
                             <p className="text-xs text-green-400 mt-1">
                               Economia de R${savingsAmount.toFixed(2)} vs mensal
                             </p>
                           )}
        </div>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="shrink-0 rounded-full p-1 bg-warning-purple/20">
                <Check className="h-3 w-3 text-warning-purple" />
              </div>
              <p className="text-sm text-white/70">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
        <Button 
          className={cn(
            "w-full rounded-full transition-all duration-500",
            popular 
              ? "gradient-button hover-glow" 
              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
