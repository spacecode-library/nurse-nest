
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";

function Hero() {
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
  
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex gap-8 py-20 lg:py-40 items-start justify-start flex-col text-left">
          <div className="flex gap-4 flex-col max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tighter text-left font-regular text-white px-4 md:px-0 my-8 md:my-[132px] md:mx-[19px]">
              <span className="text-white">Need a</span>
              <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span 
                    key={index} 
                    className="absolute font-semibold text-blue-300" 
                    initial={{
                      opacity: 0,
                      y: "-100"
                    }} 
                    transition={{
                      type: "spring",
                      stiffness: 50
                    }} 
                    animate={titleNumber === index ? {
                      y: 0,
                      opacity: 1
                    } : {
                      y: titleNumber > index ? -150 : 150,
                      opacity: 0
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-white"> nurse?</span>
            </h1>

            {/* Content block moved significantly lower on mobile */}
            <div className="mt-8 md:mt-0 mb-16 md:mb-0">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-blue-100 max-w-2xl text-left px-4 md:px-0 mb-6">
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 px-4 md:px-0 w-full md:w-auto">
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
