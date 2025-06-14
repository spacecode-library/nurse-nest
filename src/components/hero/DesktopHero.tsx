
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { RotatingText } from "./RotatingText";
import { BUTTON_GLOW_CONFIGS } from "./constants";
import { RotatingTextProps } from "./types";

interface DesktopHeroProps extends RotatingTextProps {}

export function DesktopHero({ titles, titleNumber }: DesktopHeroProps) {
  return (
    <div className="w-full relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex gap-8 py-20 lg:py-40 items-start justify-start flex-col text-left">
          <div className="flex flex-col justify-start max-w-3xl mt-12">
            {/* Desktop Header */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl tracking-tighter text-left font-regular text-white font-extrabold leading-tight mb-8">
              <span className="text-white block">Need a</span>
              
              <RotatingText titles={titles} titleNumber={titleNumber} isMobile={false} />
              
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
