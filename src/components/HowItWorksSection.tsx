
import React from 'react';
import { BackgroundBeams } from './ui/background-beams';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section-with-hover-effects';
import { useIsMobile } from '@/hooks/use-mobile';

export default function HowItWorksSection() {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative py-8 md:py-16 bg-slate-900 pb-6 md:pb-8" id="how-it-works">
      {/* Background Beams Animation - Dark Version */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      
      {/* Very light overlay to ensure text readability while keeping beams bright */}
      <div className="absolute inset-0 bg-slate-900/20 z-10"></div>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"></div>
      
      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4 md:mb-6">
            <img 
              src={isMobile ? "/lovable-uploads/f00fda9e-52dd-457d-983d-8710d48ec56a.png" : "/lovable-uploads/adaa6990-ba69-4586-88e7-03c12d0fd8b8.png"}
              alt="Why Choose NurseNest" 
              className={`w-auto object-contain ${
                isMobile 
                  ? 'h-16 max-w-[280px]' 
                  : 'h-28 md:h-32 lg:h-36'
              }`}
            />
          </div>
        </div>
        
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
}
