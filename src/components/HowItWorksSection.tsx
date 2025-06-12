
import React from 'react';
import { BackgroundBeams } from './ui/background-beams';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section-with-hover-effects';

export default function HowItWorksSection() {
  return (
    <section 
      className="relative py-12 md:py-16 min-h-screen bg-slate-900" 
      id="how-it-works"
    >
      {/* Background Beams Animation - Dark Version */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      
      {/* Dark overlay to ensure proper contrast */}
      <div className="absolute inset-0 bg-slate-900/80 z-10"></div>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"></div>
      
      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/adaa6990-ba69-4586-88e7-03c12d0fd8b8.png" 
              alt="Why Choose NurseNest" 
              className="h-16 md:h-20 lg:h-24 w-auto"
            />
          </div>
        </div>
        
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
}
