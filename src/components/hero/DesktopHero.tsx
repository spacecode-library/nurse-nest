
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
      <div className="container mx-auto px-4 md:px-8">
        <div
          className="
            flex flex-col
            gap-8
            py-20
            md:py-32
            lg:py-40
            items-start
            justify-start
            text-left
            min-h-[75vh]
            md:min-h-[80vh]
          "
        >
          <div className="flex flex-col justify-start max-w-3xl md:max-w-4xl mt-12 md:mt-4">
            {/* Desktop & Tablet Header */}
            <h1 className="
              text-4xl
              md:text-6xl
              lg:text-7xl
              tracking-tight
              text-left
              font-extrabold
              leading-tight
              mb-2
              md:mb-4
              "
              style={{
                lineHeight: "1.13",
                letterSpacing: "-0.02em",
                // Emphasize large type at md+, bolder for tablet
              }}
            >
              <span className="block text-white">Need a</span>
              {/* Rotating text: fatter and more visible for tablet */}
              <span className="block md:inline">
                <RotatingText
                  titles={titles}
                  titleNumber={titleNumber}
                  isMobile={false}
                />
              </span>
              <span className="block text-white">nurse?</span>
            </h1>

            {/* Desktop & Tablet CTA Section */}
            <div className="mt-16 md:mt-20 space-y-6 max-w-2xl">
              <p className="
                text-base
                md:text-xl
                lg:text-2xl
                leading-relaxed
                tracking-tight
                text-blue-100
                text-left
                max-w-2xl
              ">
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>
              
              <div className="flex flex-col md:flex-row md:space-x-5 gap-4 md:gap-0 w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <GlowEffect {...{...BUTTON_GLOW_CONFIGS.primary, scale: 1.12, intensity: 0.38}} />
                  <Button
                    size="lg"
                    className="
                      relative gap-4
                      text-white bg-sky-300 hover:bg-sky-200
                      w-full md:w-auto
                      min-h-[48px] md:min-h-[56px] lg:min-h-[60px]
                      text-base md:text-lg lg:text-xl
                      px-6 md:px-8 lg:px-10
                      h-12 md:h-14
                      font-semibold
                    "
                  >
                    Request a Nurse <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
                <div className="relative flex-1 md:flex-initial">
                  <GlowEffect {...{...BUTTON_GLOW_CONFIGS.secondary, scale: 1.07}} />
                  <Button
                    size="lg"
                    className="
                      relative gap-4
                      bg-white text-blue-600 hover:bg-blue-50
                      w-full md:w-auto
                      min-h-[48px] md:min-h-[56px] lg:min-h-[60px]
                      text-base md:text-lg lg:text-xl
                      px-6 md:px-8 lg:px-10
                      h-12 md:h-14
                      font-semibold
                    "
                    variant="outline"
                  >
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
