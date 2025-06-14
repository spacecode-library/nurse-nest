
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";

// Animation constants
const ANIMATION_CONFIG = {
  rotationInterval: 2000,
  mobileRotatingTextHeight: 48, // Reduced from 64 to bring text closer
  desktopRotatingTextHeight: 80,
  desktopRotatingTextWidth: 300,
  animationTransition: {
    type: "spring" as const,
    stiffness: 50
  }
};

// Nursing specialties for rotating text
const NURSING_TITLES = [
  "Specialized", "Night", "Private Duty", "Compassionate", 
  "Newborn", "Home Care", "Reliable", "Wound Care", 
  "Post-Surgery", "Gentle"
];

// Glow effect configurations
const BUTTON_GLOW_CONFIGS = {
  primary: {
    colors: ['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa'],
    mode: 'rotate' as const,
    blur: 'soft' as const,
    duration: 3,
    scale: 1.05,
    intensity: 0.2
  },
  secondary: {
    colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1'],
    mode: 'pulse' as const,
    blur: 'soft' as const,
    duration: 2,
    scale: 1.03,
    intensity: 0.35
  }
};

interface HeroProps {
  isMobile?: boolean;
}

function Hero({ isMobile = false }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => NURSING_TITLES, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber(prev => prev === titles.length - 1 ? 0 : prev + 1);
    }, ANIMATION_CONFIG.rotationInterval);
    
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const getAnimationProps = (index: number) => ({
    initial: { opacity: 0, y: isMobile ? 40 : 64 }, // Reduced mobile y offset from 56 to 40
    transition: ANIMATION_CONFIG.animationTransition,
    animate: titleNumber === index 
      ? { y: 0, opacity: 1 }
      : { y: titleNumber > index ? (isMobile ? -40 : -64) : (isMobile ? 40 : 64), opacity: 0 } // Reduced mobile offsets
  });

  if (isMobile) {
    return (
      <div className="w-full h-screen relative">
        {/* Mobile Header */}
        <div 
          className="absolute w-full px-4 z-20"
          style={{ top: '25vh' }}
        >
          <h1 className="tracking-tighter font-regular text-white leading-tight text-4xl">
            <span className="block text-white mb-2">Need a</span>
            
            {/* Mobile rotating text */}
            <div 
              className="relative w-full mb-2"
              style={{ 
                height: `${ANIMATION_CONFIG.mobileRotatingTextHeight}px`,
                overflow: 'visible' 
              }}
            >
              <span className="text-white">&nbsp;</span>
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold text-blue-300 left-0 top-0 w-max leading-tight py-1"
                  {...getAnimationProps(index)}
                >
                  {title}
                </motion.span>
              ))}
            </div>
            
            <span className="block text-white">nurse?</span>
          </h1>
        </div>

        {/* Mobile CTA Section */}
        <div 
          className="absolute w-full px-4 z-20"
          style={{ bottom: '20px' }}
        >
          <p className="text-base leading-relaxed tracking-tight mb-6 text-slate-50">
            Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <div className="relative">
              <GlowEffect {...BUTTON_GLOW_CONFIGS.primary} />
              <Button size="lg" className="relative gap-4 text-white bg-sky-300 hover:bg-sky-200 w-full min-h-[48px] text-base px-6">
                Request a Nurse <PhoneCall className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <GlowEffect {...BUTTON_GLOW_CONFIGS.secondary} />
              <Button size="lg" className="relative gap-4 bg-white text-blue-600 hover:bg-blue-50 w-full min-h-[48px] text-base px-6" variant="outline">
                Join as a Nurse <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="w-full relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex gap-8 py-20 lg:py-40 items-start justify-start flex-col text-left">
          <div className="flex flex-col justify-start max-w-3xl mt-12">
            {/* Desktop Header */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tighter text-left font-regular text-white font-extrabold leading-tight mb-8">
              <span className="text-white block">Need a</span>
              
              {/* Desktop rotating text */}
              <span className="text-white block">
                <span className="inline-block">
                  <span className="text-white"> </span>
                  <span 
                    className="relative inline-block"
                    style={{
                      width: `${ANIMATION_CONFIG.desktopRotatingTextWidth}px`,
                      height: `${ANIMATION_CONFIG.desktopRotatingTextHeight}px`,
                      overflow: 'visible'
                    }}
                  >
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute top-0 left-0 font-semibold text-blue-300 whitespace-nowrap leading-tight py-1"
                        {...getAnimationProps(index)}
                      >
                        {title}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </span>
              
              <span className="text-white block">nurse?</span>
            </h1>

            {/* Desktop CTA Section */}
            <div className="mt-20 space-y-6">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-blue-100 max-w-2xl text-left">
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <GlowEffect {...{...BUTTON_GLOW_CONFIGS.primary, scale: 1.1, intensity: 0.35}} />
                  <Button size="lg" className="relative gap-4 text-white bg-sky-300 hover:bg-sky-200 w-full md:w-auto min-h-[48px] text-base md:text-lg px-6 md:px-8">
                    Request a Nurse <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <GlowEffect {...{...BUTTON_GLOW_CONFIGS.secondary, scale: 1.05}} />
                  <Button size="lg" className="relative gap-4 bg-white text-blue-600 hover:bg-blue-50 w-full md:w-auto min-h-[48px] text-base md:text-lg px-6 md:px-8" variant="outline">
                    Join as a Nurse <MoveRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
