
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
      {/* Mobile Header with improved semantics and typography */}
      <header 
        className="absolute w-full px-4 z-20"
        style={{ top: '25vh' }}
        role="banner"
      >
        <h1 className="tracking-tighter font-regular text-white leading-tight text-4xl">
          <span className="block text-white mb-1">Need a</span>
          
          <RotatingText titles={titles} titleNumber={titleNumber} isMobile={true} />
          
          <span className="block text-white mt-1">nurse?</span>
        </h1>
      </header>

      {/* Mobile CTA Section with improved accessibility */}
      <section 
        className="absolute w-full px-4 z-20"
        style={{ bottom: '20px' }}
        role="main"
        aria-label="Call to action section"
      >
        <p className="text-base leading-relaxed tracking-tight mb-6 text-slate-50">
          Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
        </p>
        
        <div className="flex gap-3 w-full" role="group" aria-label="Primary actions">
          <div className="relative flex-1">
            <GlowEffect {...BUTTON_GLOW_CONFIGS.primary} />
            <Button 
              size="lg" 
              className="relative gap-2 text-white bg-sky-300 hover:bg-sky-200 w-full min-h-[48px] text-sm px-4"
              aria-label="Request a nurse for medical care"
            >
              Request a Nurse <PhoneCall className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="relative flex-1">
            <GlowEffect {...BUTTON_GLOW_CONFIGS.secondary} />
            <Button 
              size="lg" 
              className="relative gap-2 bg-white text-blue-600 hover:bg-blue-50 w-full min-h-[48px] text-sm px-4" 
              variant="outline"
              aria-label="Join our platform as a healthcare professional"
            >
              Join as a Nurse <MoveRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
