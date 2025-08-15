
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ShieldCheck, Zap, Clock } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [codeIndex, setCodeIndex] = useState(0);

  // Matrix-like code snippets that will rotate in the background
  const hackerCodeSnippets = [
    `/* Anti-detection system */
function bypassSecurity() {
  const detection = isScanActive();
  if (detection) {
    return obfuscateProcess();
  }
  return true;
}

// Memory manipulation
0xD4F2 0xA231 0xE4F9
interceptCall(0x482A);`,

    `/* FiveM protection */
class BypassCore {
  constructor() {
    this.hookedFunctions = [];
    this.initMemoryPatches();
  }
  
  hideFromScanner() {
    // Undetectable
    return 0xFFFF;
  }
}

// Signature: F2 44 0F 10 3D`,

    `/* Kernel mode access */
#define BYPASS_ENABLED 1
#include "memory.h"

void patchMemory() {
  uint64_t base = getBaseAddress();
  uint8_t payload[] = {
    0x90, 0x90, 0x90, 0x90
  };
  writeToProcess(base + 0x1337, payload);
}`,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Rotate through code snippets
    const codeRotation = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % hackerCodeSnippets.length);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(codeRotation);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-warning-purple to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-warning-purple/30 rounded-full filter blur-[120px] opacity-50"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-warning-purple-dark/30 rounded-full filter blur-[150px] opacity-40"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className={`space-y-8 max-w-xl transition-all duration-700 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
            <div>
              <div className="inline-flex items-center bg-warning-purple/10 px-3 py-1 rounded-full text-warning-purple text-sm font-medium mb-6 border border-warning-purple/20">
                <span className="animate-pulse mr-2">⬤</span> Nova versão disponível v2.8
              </div>
              <h1 className="font-display font-bold text-5xl md:text-6xl mb-4 hero-text-shadow leading-tight text-white">
                O Melhor <span className="text-gradient">Bypass</span> para FiveM
              </h1>
              <p className="text-lg text-white/70 mb-8">
                Acesse servidores com as melhores proteções do mercado de forma segura e confiável. Warning Bypass oferece a solução perfeita para jogadores de FiveM.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                className="gradient-button rounded-full text-base py-6 px-8 hover-glow animate-pulse-glow"
                onClick={() => {
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                Comprar Agora <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border border-warning-purple/30 text-white hover:bg-warning-purple/20 rounded-full text-base py-6 px-8"
                onClick={() => window.open('https://www.youtube.com/@WarningBypass', '_blank')}
              >
                Ver Demonstração
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-3 animate-pulse-glow">
                  <ShieldCheck className="h-6 w-6 text-warning-purple" />
                </div>
                <p className="text-sm text-white/80">100% Indetectável</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-3 animate-pulse-glow">
                  <Zap className="h-6 w-6 text-warning-purple" />
                </div>
                <p className="text-sm text-white/80">Atualização Contínua</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-warning-purple/20 flex items-center justify-center mb-3 animate-pulse-glow">
                  <Clock className="h-6 w-6 text-warning-purple" />
                </div>
                <p className="text-sm text-white/80">Suporte 24/7</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Decorative circle */}
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-warning-purple to-warning-purple-light opacity-50 blur-md animate-pulse-slow"></div>
              
              {/* Logo/Featured Image */}
              <div className="relative z-10 glass-card rounded-3xl p-8">
                <img 
                  src="/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png" 
                  alt="Warning Bypass" 
                  className="h-52 w-52 object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold text-warning-purple font-display">WARNING BYPASS</h3>
                  <p className="text-sm text-white/60 mt-2">A solução definitiva para FiveM</p>
                </div>
              </div>
              
              {/* Matrix-like code floating elements instead of text labels */}
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4">
                <div className="glass bg-black/70 p-3 rounded-lg max-w-[180px] overflow-hidden animate-float" style={{animationDelay: '1s'}}>
                  <pre className="text-warning-purple text-xs font-mono">
                    <code>
                      {`0x7FF0 0xAB12 0x4821
kernelMode = true;
bypassScanner();`}
                    </code>
                  </pre>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 transform -translate-x-1/2">
                <div className="glass bg-black/70 p-3 rounded-lg max-w-[220px] overflow-hidden animate-float" style={{animationDelay: '1.5s'}}>
                  <pre className="text-warning-purple text-xs font-mono">
                    <code>
                      {hackerCodeSnippets[codeIndex]}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
