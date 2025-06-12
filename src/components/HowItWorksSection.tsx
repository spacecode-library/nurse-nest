
import React from 'react';
import { BeamsBackground } from './ui/beams-background';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section-with-hover-effects';

export default function HowItWorksSection() {
  return (
    <section 
      className="relative py-12 md:py-16 min-h-auto h-auto" 
      id="how-it-works"
    >
      {/* Beams Background Animation */}
      <div className="absolute inset-0">
        <BeamsBackground />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <div className="text-white">Why Choose</div>
            <div className="text-blue-300">NurseNest?</div>
          </h2>
        </div>
        
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
}
