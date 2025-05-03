
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover animate-on-scroll opacity-0"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-16 md:pt-24">
        <div className="max-w-xl">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg animate-on-scroll opacity-0">
              Specialized Nurses{' '}
              <span className="flex items-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="text-blue-400 inline-block"
                >
                  Delivered
                </motion.span>
              </span>
              to Your Doorstep
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-lg drop-shadow-md animate-on-scroll opacity-0">
              Nationwide nurse-matching for newborns, elderly loved ones, and private practices — all backed by real clinical experience.
            </p>
            <div className="animate-on-scroll opacity-0">
              <Button id="hero-cta-button" className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg">
                Request a Nurse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
