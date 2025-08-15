
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: "aspectfps",
    role: "Jogador Profissional",
    content: "O Warning Bypass é simplesmente incrível! Nunca tive problemas com detecção e posso jogar tranquilamente em qualquer servidor de FiveM.",
    rating: 5
  },
  {
    id: 2,
    name: "introfvm",
    role: "Streamer",
    content: "Como streamer, precisava de uma solução confiável para acessar diversos servidores. O Warning Bypass superou todas as minhas expectativas.",
    rating: 5
  },
  {
    id: 3,
    name: "facadafakekkk",
    role: "Gamer Casual",
    content: "Mesmo sendo um jogador casual, o Warning Bypass melhorou muito minha experiência. O suporte é excelente e sempre respondem rapidamente.",
    rating: 4
  },
  {
    id: 4,
    name: "inetz gaykkk",
    role: "Desenvolvedor de Mods",
    content: "Como desenvolvedor de mods, precisava testar em vários ambientes. O Warning Bypass me permite acessar qualquer servidor sem problemas.",
    rating: 5
  },
  {
    id: 5,
    name: "deverfake",
    role: "Jogador Competitivo",
    content: "O Warning Bypass é essencial para meu gameplay competitivo. Performance incrível e zero detecções. Recomendo para todos!",
    rating: 5
  },
  {
    id: 6,
    name: "rayfps1",
    role: "Jogador Hardcore",
    content: "Uso o Warning Bypass há meses e nunca tive problemas. É a melhor solução do mercado para bypass de FiveM!",
    rating: 5
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('testimonials');
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-warning-purple fill-warning-purple' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute top-1/4 left-20 w-80 h-80 bg-warning-purple/20 rounded-full filter blur-[100px] opacity-40"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
          <h2 className="font-display text-4xl font-bold mb-4 text-gradient">
            O que dizem nossos clientes
          </h2>
          <p className="text-lg text-white/70">
            Centenas de jogadores confiam no Warning Bypass para suas experiências de jogo. Veja o que eles têm a dizer.
          </p>
        </div>

        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'}`}>
          <div className="mx-auto max-w-4xl">
            {/* Testimonial cards */}
            <div className="relative h-[400px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-700 glass-card rounded-xl p-8",
                    index === currentIndex 
                      ? "opacity-100 transform-none" 
                      : "opacity-0 translate-y-8 pointer-events-none"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative">
                          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-warning-purple to-warning-purple-light opacity-75 blur-sm"></div>
                          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-warning-purple to-warning-purple-light flex items-center justify-center border-2 border-warning-purple/30">
                            <span className="text-white font-bold text-lg">
                              {testimonial.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white font-display">{testimonial.name}</h3>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                        <div className="flex items-center mt-2">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-lg text-white/80 italic">"{testimonial.content}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-warning-purple"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
