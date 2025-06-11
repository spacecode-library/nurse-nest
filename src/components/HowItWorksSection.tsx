
import React from 'react';
import { AuroraBackground } from './ui/aurora-background';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section-with-hover-effects';

export default function HowItWorksSection() {
  return (
    <AuroraBackground 
      className="relative py-20 md:py-32 min-h-auto h-auto" 
      id="how-it-works"
      showRadialGradient={false}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-light text-center mb-12 text-[#1e293b]">
          Why Choose Nurse Nest
        </h2>
        
        <FeaturesSectionWithHoverEffects />
      </div>
    </AuroraBackground>
  );
}
