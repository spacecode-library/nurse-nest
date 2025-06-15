
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
            py-20 md:py-36 lg:py-44
            items-start
            justify-start
            text-left
            min-h-[75vh]
            md:min-h-[80vh]
          "
        >
          <div className="flex flex-col justify-start max-w-3xl md:max-w-5xl lg:max-w-6xl mt-12 md:mt-10 lg:mt-4">
            {/* Desktop & Tablet Header */}
            <h1
              className="
                text-4xl
                md:text-7xl
                lg:text-8xl
                xl:text-9xl
                tracking-tight
                text-left
                font-extrabold
                leading-tight
                mb-2
                md:mb-7
                lg:mb-8
                "
              style={{
                lineHeight: "1.10",
                letterSpacing: "-0.025em",
              }}
            >
              <span className="block text-white">Need a</span>
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
            <div className="mt-16 md:mt-24 space-y-7 max-w-2xl md:max-w-3xl">
              <p
                className="
                  text-base
                  md:text-2xl
                  lg:text-3xl
                  leading-relaxed
                  tracking-tight
                  text-blue-100
                  text-left
                  max-w-2xl
                "
              >
                Skip the waiting rooms. Skip the stress. Our concierge nursing platform delivers expert care straight to your door, nationwide. Hospital-quality treatment in your living room. Because the best care happens where you feel safest.
              </p>

              <div className="flex flex-col md:flex-row md:space-x-7 gap-4 md:gap-0 w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <GlowEffect {...{ ...BUTTON_GLOW_CONFIGS.primary, scale: 1.15, intensity: 0.4 }} />
                  <Button
                    size="lg"
                    className="
                      relative gap-4
                      text-white bg-sky-300 hover:bg-sky-200
                      w-full md:w-auto
                      min-h-[52px] md:min-h-[64px] lg:min-h-[68px]
                      text-lg md:text-2xl lg:text-3xl
                      px-8 md:px-12 lg:px-14
                      h-14 md:h-16
                      font-semibold
                      rounded-xl
                    "
                  >
                    Request a Nurse <PhoneCall className="w-4 h-4 md:w-6 md:h-6" />
                  </Button>
                </div>
                <div className="relative flex-1 md:flex-initial">
                  <GlowEffect {...{ ...BUTTON_GLOW_CONFIGS.secondary, scale: 1.1 }} />
                  <Button
                    size="lg"
                    className="
                      relative gap-4
                      bg-white text-blue-600 hover:bg-blue-50
                      w-full md:w-auto
                      min-h-[52px] md:min-h-[64px] lg:min-h-[68px]
                      text-lg md:text-2xl lg:text-3xl
                      px-8 md:px-12 lg:px-14
                      h-14 md:h-16
                      font-semibold
                      rounded-xl
                    "
                    variant="outline"
                  >
                    Join as a Nurse <MoveRight className="w-4 h-4 md:w-6 md:h-6" />
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
