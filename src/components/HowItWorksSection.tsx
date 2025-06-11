
import React from 'react';
import { Component as SilkBackground } from './ui/silk-background-animation';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section-with-hover-effects';

export default function HowItWorksSection() {
  return (
    <section 
      className="relative py-12 md:py-16 min-h-auto h-auto" 
      id="how-it-works"
    >
      {/* Silk Background Animation */}
      <div className="absolute inset-0">
        <SilkBackground />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-30">
        {/* Replace title with uploaded image - made smaller */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/777025b3-590c-4edc-9777-ca6c29756c00.png" 
            alt="Nurse Nest" 
            className="mx-auto max-w-md h-auto"
          />
        </div>
        
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
}
