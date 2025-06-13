
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";

interface HeroProps {
  isMobile?: boolean;
}

function Hero({
  isMobile = false
}: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["Specialized", "Night", "Private Duty", "Compassionate", "Newborn", "Home Care", "Reliable", "Wound Care", "Post-Surgery", "Gentle"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  if (isMobile) {
    return (
      <div className="w-full h-screen relative">
        {/* Mobile Header - Locked Position */}
        <div className="mobile-hero-header-locked absolute w-full px-4" style={{ top: '25vh', zIndex: 20 }}>
          <h1 className="tracking-tighter font-regular text-white text-5xl leading-tight">
            <span className="block text-white mb-2">Need a</span>
            
            {/* Mobile rotating text with increased height and proper padding */}
            <div className="rotating-text-mobile relative w-full mb-2" style={{ height: '64px', overflow: 'visible' }}>
              <span className="text-white">&nbsp;</span>
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold text-blue-300 left-0"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: 'max-content',
                    lineHeight: '1.2',
                    paddingTop: '4px',
                    paddingBottom: '8px'
                  }}
                  initial={{ opacity: 0, y: 56 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={titleNumber === index ? {
                    y: 0,
                    opacity: 1
                  } : {
                    y: titleNumber > index ? -56 : 56,
                    opacity: 0
                  }}
                >
                  {title}
                </motion.span>
              ))}
            </div>
            
            <span className="block text-white">nurse?</span>
          </h1>
        </div>

        {/* Mobile Description/Buttons - Bottom positioned */}
        <div className="mobile-hero-bottom-content absolute w-full px-4" style={{ bottom: '20px', zIndex: 20 }}>
          <p className="text-base leading-relaxed tracking-tight mb-6 text-slate-50">
            Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <div className="relative">
              <GlowEffect colors={['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa']} mode="rotate" blur="soft" duration={3} scale={1.05} intensity={0.2} />
              <Button size="lg" className="relative gap-4 text-white bg-sky-300 hover:bg-sky-200 w-full min-h-[48px] text-base px-6">
                Request a Nurse <PhoneCall className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <GlowEffect colors={['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1']} mode="pulse" blur="soft" duration={2} scale={1.03} />
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
          <div className="flex flex-col justify-start max-w-3xl">
            {/* Desktop Header - FIXED rotating text alignment */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tighter text-left font-regular text-white font-extrabold leading-tight mb-8">
              <span className="text-white block">Need a</span>
              
              {/* COMPLETELY RESTRUCTURED Desktop rotating text for perfect alignment */}
              <span className="text-white block">
                <span className="inline-block">
                  <span className="text-white"> </span>
                  <span className="relative inline-block" style={{ width: '300px', height: '80px', overflow: 'visible' }}>
                    {titles.map((title, index) => (
                      <motion.span 
                        key={index} 
                        className="absolute top-0 left-0 font-semibold text-blue-300 whitespace-nowrap"
                        style={{ 
                          lineHeight: '1.1',
                          verticalAlign: 'baseline',
                          paddingTop: '4px',
                          paddingBottom: '8px'
                        }}
                        initial={{ opacity: 0, y: 64 }} 
                        transition={{ type: "spring", stiffness: 50 }} 
                        animate={titleNumber === index ? {
                          y: 0,
                          opacity: 1
                        } : {
                          y: titleNumber > index ? -64 : 64,
                          opacity: 0
                        }}
                      >
                        {title}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </span>
              
              <span className="text-white block">nurse?</span>
            </h1>

            {/* Desktop Description/Buttons - Moved lower with increased spacing */}
            <div className="mt-20 space-y-6">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-blue-100 max-w-2xl text-left">
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <GlowEffect colors={['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa']} mode="rotate" blur="soft" duration={3} scale={1.1} intensity={0.35} />
                  <Button size="lg" className="relative gap-4 text-white bg-sky-300 hover:bg-sky-200 w-full md:w-auto min-h-[48px] text-base md:text-lg px-6 md:px-8">
                    Request a Nurse <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <GlowEffect colors={['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1']} mode="pulse" blur="soft" duration={2} scale={1.05} />
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
