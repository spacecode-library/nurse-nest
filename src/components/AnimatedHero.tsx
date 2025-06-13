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
    return <div className="w-full relative h-screen">
        {/* MOBILE HEADER - POSITION LOCKED - DO NOT MODIFY */}
        <div className="mobile-hero-header-locked" style={{
        position: 'absolute !important' as any,
        top: '25vh !important',
        left: '16px !important',
        right: '16px !important',
        zIndex: 20
      }}>
          <h1 className="tracking-tighter font-regular text-white text-5xl leading-tight">
            <span className="block text-white">Need a</span>
            <span className="relative flex w-full justify-start overflow-hidden text-left items-center" style={{
            height: '60px !important' as any,
            lineHeight: '1.3 !important',
            paddingBottom: '3px !important'
          }}>
              &nbsp;
              {titles.map((title, index) => <motion.span key={index} className="absolute font-semibold text-blue-300 left-0 top-0" style={{
              lineHeight: '1.3 !important',
              paddingBottom: '3px !important'
            }} initial={{
              opacity: 0,
              y: "-100"
            }} transition={{
              type: "spring",
              stiffness: 50
            }} animate={titleNumber === index ? {
              y: 0,
              opacity: 1
            } : {
              y: titleNumber > index ? -150 : 150,
              opacity: 0
            }}>
                  {title}
                </motion.span>)}
            </span>
            <span className="block text-white">nurse?</span>
          </h1>
        </div>

        {/* Mobile Description and Buttons - Bottom Aligned with FAQ */}
        <div className="mobile-hero-bottom-aligned" style={{
        position: 'absolute !important' as any,
        bottom: '20px !important',
        left: '5% !important',
        right: '5% !important',
        width: '90% !important',
        zIndex: 20
      }}>
          <div className="space-y-6">
            <p className="text-base leading-relaxed tracking-tight text-slate-50">
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
      </div>;
  }
  return <div className="w-full flex items-center justify-start min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-start justify-center text-left max-w-4xl ml-0">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl tracking-tighter font-regular text-white leading-tight py-[66px] lg:text-7xl">
              <span className="block text-white mb-1">Need a</span>
              <span className="relative flex w-full justify-start overflow-hidden text-left h-16 lg:h-20 items-center mb-1">
                &nbsp;
                {titles.map((title, index) => <motion.span key={index} className="absolute font-semibold text-blue-300 left-0 top-0" initial={{
                opacity: 0,
                y: "-100"
              }} transition={{
                type: "spring",
                stiffness: 50
              }} animate={titleNumber === index ? {
                y: 0,
                opacity: 1
              } : {
                y: titleNumber > index ? -150 : 150,
                opacity: 0
              }}>
                    {title}
                  </motion.span>)}
              </span>
              <span className="block text-white">nurse?</span>
            </h1>

            {/* Desktop Description and Buttons - Moved Down More */}
            <div className="mt-12 md:mt-16 lg:mt-20 space-y-6">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-blue-100 max-w-2xl">
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
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
    </div>;
}
export { Hero };