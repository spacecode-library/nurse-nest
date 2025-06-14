
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { RotatingText } from "./RotatingText";
import { BUTTON_GLOW_CONFIGS } from "./constants";
import { RotatingTextProps } from "./types";

interface MobileHeroProps extends RotatingTextProps {}

export function MobileHero({ titles, titleNumber }: MobileHeroProps) {
  return (
    <div className="w-full h-screen relative">
      {/* Mobile Header */}
      <div 
        className="absolute w-full px-4 z-20"
        style={{ top: '30vh' }}
      >
        <h1 className="tracking-tighter font-regular text-white leading-tight text-4xl">
          <span className="block text-white mb-2">Need a</span>
          
          <RotatingText titles={titles} titleNumber={titleNumber} isMobile={true} />
          
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
