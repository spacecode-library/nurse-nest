
import React from 'react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  const steps = [
    {
      number: 1,
      title: "Submit Your Care Request",
      description: "Complete our streamlined intake form with your specific care needs",
      mockup: "/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png", // Phone showing form
      position: "top-left"
    },
    {
      number: 2,
      title: "Get Matched with Qualified Nurses",
      description: "Our platform connects you with vetted, licensed nurses in your area",
      mockup: "/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png", // Nurse profiles
      position: "top-right"
    },
    {
      number: 3,
      title: "Review & Select Your Nurse",
      description: "Review profiles, credentials, and schedule interviews with top candidates",
      mockup: "/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png", // Profile detail
      position: "bottom-left"
    },
    {
      number: 4,
      title: "Coordinate Care Seamlessly",
      description: "Manage all aspects of care through our secure, mobile-optimized platform",
      mockup: "/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png", // Dashboard
      position: "bottom-right"
    }
  ];

  return (
    <section className="relative py-20 md:py-32" id="how-it-works" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
    }}>
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          {/* Header with uploaded image */}
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/1379c303-e425-47f4-99a8-e90f3e07c9ca.png" 
              alt="How It Works" 
              className="h-16 md:h-20 w-auto max-w-full object-contain" 
            />
          </div>
          
          {/* Decorative accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal">
            Your trusted pathway to exceptional nursing care
          </p>
        </AnimatedSection>
        
        {/* Desktop Circular Flow Layout (768px+) */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Central connecting lines - SVG for precise control */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
            {/* Curved dotted lines connecting the steps in a flow pattern */}
            <path 
              d="M200,150 Q400,50 600,150" 
              stroke="#9bcbff" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.6"
            />
            <path 
              d="M600,150 Q700,300 600,450" 
              stroke="#9bcbff" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.6"
            />
            <path 
              d="M600,450 Q400,550 200,450" 
              stroke="#9bcbff" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.6"
            />
            <path 
              d="M200,450 Q100,300 200,150" 
              stroke="#9bcbff" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.6"
            />
          </svg>
          
          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-2 gap-16 h-[600px] relative">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                <div className={`relative flex items-center justify-center h-full ${
                  step.position === 'top-left' ? 'justify-end items-start pt-8' :
                  step.position === 'top-right' ? 'justify-start items-start pt-8' :
                  step.position === 'bottom-left' ? 'justify-end items-end pb-8' :
                  'justify-start items-end pb-8'
                }`}>
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm max-w-sm relative">
                    {/* Numbered Circle */}
                    <div className={`absolute w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      step.position === 'top-left' ? '-top-8 -right-8' :
                      step.position === 'top-right' ? '-top-8 -left-8' :
                      step.position === 'bottom-left' ? '-bottom-8 -right-8' :
                      '-bottom-8 -left-8'
                    }`} style={{
                      background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                    }}>
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                    
                    {/* Mockup Image */}
                    <div className="mb-6">
                      <img 
                        src={step.mockup} 
                        alt={`${step.title} mockup`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-[#1e293b] mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#475569] leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        
        {/* Mobile Vertical Flow Layout (below 768px) */}
        <div className="md:hidden relative max-w-lg mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-gradient-to-b from-[#9bcbff] to-[#3b82f6] opacity-60"></div>
          
          {/* Mobile Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div className="relative flex items-start space-x-6">
                  {/* Numbered Circle - positioned on the left */}
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                  }}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/50 flex-1 min-h-[44px]">
                    {/* Mockup Image */}
                    <div className="mb-4">
                      <img 
                        src={step.mockup} 
                        alt={`${step.title} mockup`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    
                    {/* Text Content */}
                    <h3 className="text-lg font-semibold text-[#1e293b] mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#475569] leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#9bcbff] opacity-50"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
