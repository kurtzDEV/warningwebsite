// filepath: c:\Users\user\Downloads\warningweb\src\pages\About.tsx
import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Star, Users, Clock } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState({
    header: false,
    mission: false,
    stats: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.8;
      
      const headerEl = document.getElementById('about-header');
      const missionEl = document.getElementById('about-mission');
      const statsEl = document.getElementById('about-stats');
      
      if (headerEl && headerEl.offsetTop < scrollPosition) {
        setIsVisible(prev => ({ ...prev, header: true }));
      }
      
      if (missionEl && missionEl.offsetTop < scrollPosition) {
        setIsVisible(prev => ({ ...prev, mission: true }));
      }
      
      if (statsEl && statsEl.offsetTop < scrollPosition) {
        setIsVisible(prev => ({ ...prev, stats: true }));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial render
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-24">
        {/* Header Section */}
        <section id="about-header" className="relative py-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-black via-black to-transparent"></div>
            <div className="absolute top-20 right-1/4 w-72 h-72 bg-warning-purple/30 rounded-full filter blur-[120px] opacity-50"></div>
          </div>
          
          <div className={`container px-4 mx-auto relative z-10 transition-all duration-1000 ${isVisible.header ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-5xl font-bold mb-6 text-gradient">
                Sobre o Warning Bypass
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Somos uma equipe dedicada a desenvolver soluções avançadas para jogadores de FiveM e outras plataformas. Nossa missão é proporcionar a melhor experiência possível para nossos clientes, com produtos de alta qualidade e suporte incomparável.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section id="about-mission" className="py-20 relative">
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-warning-purple-dark/30 rounded-full filter blur-[150px] opacity-40"></div>
          </div>
          
          <div className={`container px-4 mx-auto relative z-10 transition-all duration-1000 ${isVisible.mission ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <img 
                  src="/lovable-uploads/effa584b-3d8a-4aed-a167-4eec6afcb42c.png" 
                  alt="Warning Bypass Logo" 
                  className="w-full max-w-md mx-auto animate-float"
                />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold mb-6 text-gradient">
                  Nossa Missão
                </h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  No Warning Bypass, nossa missão é simples: proporcionar a melhor experiência de jogo possível para nossos clientes. Acreditamos que todos devem ter acesso a qualquer servidor de FiveM sem restrições ou limitações.
                </p>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Fundada em 2020, nossa empresa cresceu rapidamente para se tornar líder no mercado de soluções de bypass para diversas plataformas de jogos, com foco especial no FiveM. Nossa equipe é composta por desenvolvedores talentosos, especialistas em segurança digital e entusiastas de jogos.
                </p>
                <p className="text-white/70 leading-relaxed">
                  Nosso compromisso com a qualidade e a satisfação do cliente é inabalável. Trabalhamos incansavelmente para manter nossos produtos atualizados e eficazes contra as mais recentes medidas anti-cheat.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section id="about-stats" className="py-20 relative">
          <div className={`container px-4 mx-auto relative z-10 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-warning-purple/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Users className="h-8 w-8 text-warning-purple" />
                </div>
                <div className="text-4xl font-bold text-white font-display mb-2">10k+</div>
                <p className="text-white/60">Clientes Satisfeitos</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-warning-purple/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Shield className="h-8 w-8 text-warning-purple" />
                </div>
                <div className="text-4xl font-bold text-white font-display mb-2">99.9%</div>
                <p className="text-white/60">Taxa de Sucesso</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-warning-purple/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Star className="h-8 w-8 text-warning-purple" />
                </div>
                <div className="text-4xl font-bold text-white font-display mb-2">4.9/5</div>
                <p className="text-white/60">Avaliação Média</p>
              </div>
              
              <div className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-warning-purple/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Clock className="h-8 w-8 text-warning-purple" />
                </div>
                <div className="text-4xl font-bold text-white font-display mb-2">24/7</div>
                <p className="text-white/60">Suporte Disponível</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;