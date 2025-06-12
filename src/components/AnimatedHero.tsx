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
    return <div className="w-full text-left px-4">
        <div className="min-h-[60vh] flex flex-col justify-end pb-20">
          <h1 className="text-4xl tracking-tighter font-extrabold text-white mb-6 my-[171px]">
            <span className="text-white block mb-2">Need a</span>
            <span className="relative flex w-full justify-start overflow-hidden text-left h-12">
              &nbsp;
              {titles.map((title, index) => <motion.span key={index} className="absolute font-semibold text-blue-300" initial={{
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
            <span className="text-white block mt-2"> nurse?</span>
          </h1>

          <p className="text-base leading-relaxed tracking-tight mb-8 text-slate-50 max-w-md">
            Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-sm">
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
      </div>;
  }
  return <div className="w-full h-full flex items-center justify-center">
      <div className="container px-0 mx-[40px]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tighter font-extrabold text-white mb-8">
            <span className="text-white block mb-4">Need a</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center h-16 md:h-20 lg:h-24">
              &nbsp;
              {titles.map((title, index) => <motion.span key={index} className="absolute font-semibold text-blue-300" initial={{
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
            <span className="text-white block mt-4"> nurse?</span>
          </h1>

          <div className="space-y-8">
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-tight text-blue-100 max-w-3xl mx-auto">
              Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative">
                <GlowEffect colors={['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa']} mode="rotate" blur="soft" duration={3} scale={1.1} intensity={0.35} />
                <Button size="lg" className="relative gap-4 text-white bg-sky-300 hover:bg-sky-200 w-full md:w-auto min-h-[52px] text-lg px-8">
                  Request a Nurse <PhoneCall className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <GlowEffect colors={['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1']} mode="pulse" blur="soft" duration={2} scale={1.05} />
                <Button size="lg" className="relative gap-4 bg-white text-blue-600 hover:bg-blue-50 w-full md:w-auto min-h-[52px] text-lg px-8" variant="outline">
                  Join as a Nurse <MoveRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export { Hero };