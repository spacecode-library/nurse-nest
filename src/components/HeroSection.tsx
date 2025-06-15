
import { Shield, Users, Star, Clock } from "lucide-react";
import { Hero } from "@/components/AnimatedHero";
import AnimatedSection from "@/components/AnimatedSection";
import { OptimizedBackground } from "@/components/ui/optimized-background";
import { useStaggeredReveal } from "@/hooks/use-staggered-reveal";
import { LuxIcon } from "@/components/post-surgical-care/LuxIcon";

export default function HeroSection() {
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const trustIndicatorsReveal = useStaggeredReveal(4, { step: 150, initialDelay: 1200, disabled: prefersReducedMotion });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Desktop Background - Optimized */}
      <div className="hidden md:block absolute inset-0">
        <OptimizedBackground
          src="/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png"
          alt="Professional nurse providing care"
          className="w-full h-full"
          priority={true}
        />
      </div>
      
      {/* Mobile Layout - Optimized */}
      <div className="md:hidden w-full relative h-screen">
        <OptimizedBackground
          src="/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png"
          alt="Professional nurse providing mobile care"
          className="absolute inset-0 w-full h-full"
          priority={true}
        >
          {/* Hero content over background, no glass effect */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <div className="w-[92vw] max-w-md mx-auto mt-10">
              <Hero isMobile={true} />
            </div>
          </div>
        </OptimizedBackground>
      </div>
      
      {/* Desktop Hero Content */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-start">
        <div className="w-full">
          <Hero isMobile={false} />
        </div>
      </div>
      
      {/* Trust Indicators with staggered animation */}
      <div className="absolute z-10 hidden md:block bottom-8 left-0 right-0 opacity-100">
        <AnimatedSection animation="fade-up" delay={1000}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className={`flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${trustIndicatorsReveal[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <LuxIcon>
                  <Shield className="h-5 w-5 text-blue-300" />
                </LuxIcon>
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className={`flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${trustIndicatorsReveal[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <LuxIcon>
                  <Users className="h-5 w-5 text-green-300" />
                </LuxIcon>
                <span className="text-sm">Licensed Professionals</span>
              </div>
              <div className={`flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${trustIndicatorsReveal[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <LuxIcon>
                  <Star className="h-5 w-5 text-yellow-300" />
                </LuxIcon>
                <span className="text-sm">Verified Reviews</span>
              </div>
              <div className={`flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(.32,2,.55,.98)]
                ${trustIndicatorsReveal[3] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <LuxIcon>
                  <Clock className="h-5 w-5 text-teal-300" />
                </LuxIcon>
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
