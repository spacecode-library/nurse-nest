
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import '@/index.css';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [lightGlow, setLightGlow] = useState(0);

  // Create pulsing light effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLightGlow(prev => {
        if (prev >= 1) return 0;
        return prev + 0.05;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Image Background with Animated Light */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/8f74e0c5-9c2c-45c8-8588-e7b4fa1b1440.png" 
          alt="Nurse in a box delivered to doorstep" 
          className="w-full h-full object-cover"
        />

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Animated door light glow */}
        <div 
          className="absolute top-[45%] right-[30%] w-8 h-8 rounded-full bg-yellow-300 blur-md"
          style={{ 
            opacity: 0.3 + lightGlow * 0.5, 
            boxShadow: `0 0 ${10 + lightGlow * 15}px ${5 + lightGlow * 10}px rgba(255, 233, 125, ${0.5 + lightGlow * 0.3})`,
            transition: 'opacity 0.5s ease-in-out, box-shadow 0.5s ease-in-out'
          }}
        ></div>
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-16 md:pt-24">
        <div className="mt-12 md:mt-0">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              <div>Specialized Nurses</div>
              <div>
                <span className="relative">
                  <span className="animate-fade-in-delivered text-blue-400">Delivered</span>
                </span> to
              </div>
              <div>Your Doorstep</div>
            </h1>
            <p className="text-base md:text-lg text-white mb-8 max-w-lg drop-shadow-md">
              Nationwide nurse-matching for newborns, elderly loved ones, and private practices — all backed by real clinical experience.
            </p>
            <div>
              <Link to="/apply">
                <Button id="hero-cta-button" className="bg-nurse-dark hover:bg-primary-700 text-white shadow-lg button-hover-effect">
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
