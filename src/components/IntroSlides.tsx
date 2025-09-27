import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Lightbulb, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './image/ImageWithFallback';
import { ThemeToggle } from './ThemeToggle';

interface IntroSlidesProps {
  onComplete: () => void;
}

export function IntroSlides({ onComplete }: IntroSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isScrolling = useRef(false);

  const slides = [
    {
      id: 'hero',
      background: 'https://unsplash.com/photos/x5SRhkFajrA/download?force=true&w=2000',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center text-white relative z-10 px-4 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4 md:space-y-6"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              AI Cooking Assistant
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              Temukan resep, konversi takaran, dan ciptakan mahakarya di dapur Anda.
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.button
              onClick={() => setCurrentSlide(1)}
              className="text-white hover:text-amber-300 transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={32} />
            </motion.button>
          </motion.div>
        </div>
      )
    },
    {
      id: 'search',
      content: (
        <div className="h-full flex items-center justify-center px-4 md:px-8 bg-background">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1659354219576-639f95492f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsb29raW5nJTIwdGFibGV0JTIwcmVjaXBlJTIwY29va2luZ3xlbnwxfHx8fDE3NTgzMDE2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Person looking at recipe on tablet"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6 order-1 md:order-2 text-center md:text-left"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto md:mx-0"
              >
                <Search className="text-white" size={24} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Pencarian Resep Tanpa Batas
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Dari rendang hingga carbonara, tanyakan resep apa pun yang Anda inginkan dan dapatkan panduan langkah demi langkah secara instan.
              </p>
            </motion.div>
          </div>
        </div>
      )
    },
    
    {
      id: 'ingredients',
      content: (
        <div className="h-full flex items-center justify-center px-4 md:px-8 bg-background">
          <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551631759-96b8377f491c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaW5ncmVkaWVudHMlMjBsYXlvdXQlMjBlZ2dzJTIwbm9vZGxlcyUyMGdhcmxpYyUyMG9uaW9ufGVufDF8fHx8MTc1ODMwMTY3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Kitchen ingredients layout"
                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4 md:space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto"
              >
                <Lightbulb className="text-white" size={24} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Solusi Cerdas Anti Bingung
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
                Cukup sebutkan bahan yang Anda punya, seperti 'telur dan mie', dan biarkan AI kami menyarankan resep yang lezat untuk Anda.
              </p>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      content: (
        <div className="h-full flex items-center justify-center text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 dark:from-green-700 dark:to-green-900"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 space-y-6 md:space-y-8 text-white px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto"
            >
              <ChefHat className="text-green-600" size={32} />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">
              Siap Memasak Sesuatu yang Hebat?
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Mulai Chatting Sekarang
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 50;

      if (Math.abs(deltaY) > threshold) {
        isScrolling.current = true;
        setTimeout(() => { isScrolling.current = false; }, 2000);

        if (deltaY > 0) { // Swipe up
          setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        } else { // Swipe down
          setCurrentSlide(prev => Math.max(prev - 1, 0));
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      if (Math.abs(e.deltaY) > 50) {
        isScrolling.current = true;
        setTimeout(() => { isScrolling.current = false; }, 2000);

        if (e.deltaY > 0) { // Scroll down
          setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        } else { // Scroll up
          setCurrentSlide(prev => Math.max(prev - 1, 0));
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Theme Toggle - Fixed position */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed top-4 md:top-6 right-4 md:right-6 z-30"
      >
        <ThemeToggle />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full relative"
        >
          {currentSlide === 0 && (
            <div className="absolute inset-0">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${slides[0].background}')`
                }}
              />
              <div className="absolute inset-0 bg-opacity-60 dark:bg-opacity-75"></div>
            </div>
          )}

          {slides[currentSlide].content}
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="fixed right-4 md:right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-green-500 h-6 md:h-8'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
          />
        ))}
      </div>

      {/* Mobile swipe instruction */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full"
        >
          Scroll untuk melanjutkan
        </motion.div>
      </div>
    </div>
  );
}