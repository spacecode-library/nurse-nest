
import React from 'react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function HowItWorksSection() {
  useScrollAnimationObserver();
  
  const steps = [
    {
      number: 1,
      title: "Submit Your Care Request",
      description: "Complete our streamlined intake form with your specific care needs",
      mockup: "/lovable-uploads/92766299-21f0-465e-8a87-a14a4bf0ae6d.png"
    },
    {
      number: 2,
      title: "Get Matched with Qualified Nurses",
      description: "Our platform connects you with vetted, licensed nurses in your area",
      mockup: "/lovable-uploads/17e684ea-1751-468f-8dab-31672fea6992.png"
    },
    {
      number: 3,
      title: "Review & Select Your Nurse",
      description: "Review profiles, credentials, and schedule interviews with top candidates",
      mockup: "/lovable-uploads/fed8034d-e56e-4108-8298-cb66167f1a9a.png"
    },
    {
      number: 4,
      title: "Coordinate Care Seamlessly",
      description: "Manage all aspects of care through our secure, mobile-optimized platform",
      mockup: "/lovable-uploads/44ab01d1-1fbd-4112-98b7-ce8c7df3d693.png"
    }
  ];

  return (
    <section className="relative py-20 md:py-32" id="how-it-works" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
    }}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/1379c303-e425-47f4-99a8-e90f3e07c9ca.png" 
              alt="How It Works" 
              className="h-16 md:h-20 w-auto max-w-full object-contain" 
            />
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal">
            Your trusted pathway to exceptional nursing care
          </p>
        </AnimatedSection>
        
        {/* Desktop Horizontal Flow Layout (768px+) */}
        <div className="hidden md:block relative max-w-7xl mx-auto">
          {/* Organic flowing dotted line - SVG for precise control */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 400" style={{ top: '60px' }}>
            {/* Flowing organic path through all 4 steps */}
            <path 
              d="M-50,200 Q100,120 250,180 Q400,240 550,160 Q700,80 850,140 Q1000,200 1150,120 Q1250,80 1350,140" 
              stroke="#ffffff" 
              strokeWidth="3" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.8"
            />
            
            {/* Directional arrows along the path */}
            <polygon points="280,175 290,180 280,185 285,180" fill="#ffffff" opacity="0.8"/>
            <polygon points="580,155 590,160 580,165 585,160" fill="#ffffff" opacity="0.8"/>
            <polygon points="880,135 890,140 880,145 885,140" fill="#ffffff" opacity="0.8"/>
          </svg>
          
          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                <div className="relative">
                  {/* Numbered Circle */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10" style={{
                    background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                  }}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm pt-10">
                    {/* Mockup Image */}
                    <div className="mb-6">
                      <img 
                        src={step.mockup} 
                        alt={`${step.title} mockup`}
                        className="w-full h-40 object-contain rounded-lg"
                      />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-[#1e293b] mb-4 leading-tight text-center">
                      {step.title}
                    </h3>
                    <p className="text-[#475569] leading-relaxed text-sm text-center">
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
          <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-white opacity-60"></div>
          
          {/* Downward arrows */}
          <div className="absolute left-5 top-32">
            <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-white opacity-60"></div>
          </div>
          <div className="absolute left-5 top-80">
            <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-white opacity-60"></div>
          </div>
          
          {/* Mobile Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div className="relative flex items-start space-x-6">
                  {/* Numbered Circle */}
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                  }}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/50 flex-1">
                    {/* Mockup Image */}
                    <div className="mb-4">
                      <img 
                        src={step.mockup} 
                        alt={`${step.title} mockup`}
                        className="w-full h-32 object-contain rounded-lg"
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
