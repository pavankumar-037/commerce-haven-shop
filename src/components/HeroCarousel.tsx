import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselSlide {
  id?: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  overlayGradient: string;
}

interface Props {
  slides: CarouselSlide[];
  heroThumbnail?: string;
  primaryColor: string;
  onShopNow?: () => void;
  onTrendingClick?: () => void;
}

const HeroCarousel = ({ slides, heroThumbnail, primaryColor, onShopNow, onTrendingClick }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`min-w-full bg-gradient-to-br ${slide.bgGradient} relative flex-shrink-0`}
          >
            <div className={`absolute inset-0 ${slide.overlayGradient}`} />
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-center">
              <div className="backdrop-blur-sm bg-white/20 rounded-3xl p-12 border border-white/30 shadow-2xl">
                {heroThumbnail && (
                  <img 
                    src={heroThumbnail} 
                    alt="Hero" 
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-white/50 shadow-lg"
                  />
                )}
                <h1 className="text-6xl font-bold mb-4 text-stone-800 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl mb-8 text-stone-700 animate-fade-in">
                  {slide.subtitle}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    size="lg" 
                    className="text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: primaryColor }}
                    onClick={onShopNow}
                  >
                    Shop Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-stone-400 text-stone-700 hover:bg-stone-100 font-semibold px-8 py-3 rounded-full"
                    onClick={onTrendingClick}
                  >
                    Trending
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-stone-700 rounded-full backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-stone-700 rounded-full backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;