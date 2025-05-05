
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-16 md:pt-24">
        <div className="max-w-xl mt-12 md:mt-0 pl-0 md:pl-0 lg:pl-0 ml-0 md:ml-0 lg:ml-24">
          <div>
            <h1 className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 text-white drop-shadow-lg",
              !isMobile && "animate-on-scroll opacity-0"
            )}>
              <div>Specialized Nurses</div>
              <div>
                {!isMobile ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                  >
                    <span className="text-blue-400">Delivered</span> to
                  </motion.span>
                ) : (
                  <span><span className="text-blue-400">Delivered</span> to</span>
                )}
              </div>
              <div>Your Doorstep</div>
            </h1>
            <p className={cn(
              "text-base md:text-lg text-white mb-8 max-w-lg drop-shadow-md",
              !isMobile && "animate-on-scroll opacity-0"
            )}>
              Nationwide nurse-matching for newborns, elderly loved ones, and private practices — all backed by real clinical experience.
            </p>
            <div className={cn(!isMobile && "animate-on-scroll opacity-0")}>
              <Link to="/apply">
                <Button id="hero-cta-button" className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg">
                  Request a Nurse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
