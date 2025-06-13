
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
        {/* PHASE 3: Header Position Lock - Fixed at 25% from top */}
        <div 
          className="absolute w-full px-4 mobile-hero-header-locked"
          style={{ 
            top: '25vh',
            position: 'absolute',
            zIndex: 20
          }}
        >
          {/* PHASE 1: Fix Text Corruption - Proper container with overflow control */}
          <h1 className="tracking-tighter font-regular text-white text-5xl leading-tight">
            <span className="block text-white mb-2">Need a</span>
            
            {/* Fixed rotating text container with original tight bounds */}
            <div 
              className="relative w-full overflow-hidden mb-2"
              style={{ 
                height: '48px', /* Original container height restored */
                position: 'relative'
              }}
            >
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
                    lineHeight: '1.2', /* Restored original line-height */
                    paddingBottom: '3px' /* Minimal padding for descenders only */
                  }}
                  initial={{ opacity: 0, y: 48 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={titleNumber === index ? {
                    y: 0,
                    opacity: 1
                  } : {
                    y: titleNumber > index ? -48 : 48, /* Keep within original bounds */
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

        {/* PHASE 4: Description/Buttons Bottom Positioning - Aligned with FAQ button */}
        <div 
          className="absolute w-full px-4 mobile-hero-bottom-content"
          style={{ 
            bottom: '20px', /* Matches FAQ button positioning */
            position: 'absolute',
            zIndex: 20
          }}
        >
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

  // Desktop layout - COMPLETELY REFACTORED to remove inline styles
  return (
    <div className="w-full relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* STEP 1: Desktop Gap Elimination - Removed massive 132px margins */}
        <div className="flex gap-8 py-20 lg:py-40 items-start justify-start flex-col text-left">
          <div className="flex flex-col justify-start max-w-3xl space-y-4">
            {/* STEP 3: Desktop Layout Modernization - Clean Tailwind spacing */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tighter text-left font-regular text-white font-extrabold leading-none">
              <span className="text-white block">Need a</span>
              
              {/* Desktop rotating text with proper bounds */}
              <span className="relative flex w-full justify-start overflow-hidden text-left">
                <span className="w-4">&nbsp;</span>
                <div className="relative h-[1.2em] overflow-hidden">
                  {titles.map((title, index) => (
                    <motion.span 
                      key={index} 
                      className="absolute font-semibold text-blue-300 left-0 top-0" 
                      initial={{ opacity: 0, y: "-100" }} 
                      transition={{ type: "spring", stiffness: 50 }} 
                      animate={titleNumber === index ? {
                        y: 0,
                        opacity: 1
                      } : {
                        y: titleNumber > index ? -60 : 60,
                        opacity: 0
                      }}
                    >
                      {title}
                    </motion.span>
                  ))}
                </div>
              </span>
              
              <span className="text-white block">nurse?</span>
            </h1>

            {/* STEP 1: Desktop Gap Fix - Proper spacing between header and content */}
            <div className="mt-8 space-y-6">
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
