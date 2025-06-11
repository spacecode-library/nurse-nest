
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
      mockup: "/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png"
    },
    {
      number: 2,
      title: "Get Matched with Qualified Nurses",
      description: "Our platform connects you with vetted, licensed nurses in your area",
      mockup: "/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png"
    },
    {
      number: 3,
      title: "Review & Select Your Nurse",
      description: "Review profiles, credentials, and schedule interviews with top candidates",
      mockup: "/lovable-uploads/ce1b982a-1811-48d4-bb03-8510645f5d2e.png"
    },
    {
      number: 4,
      title: "Coordinate Care Seamlessly",
      description: "Manage all aspects of care through our secure, mobile-optimized platform",
      mockup: "/lovable-uploads/7d6005a3-1dca-4980-bf11-bb34da3a852e.png"
    }
  ];

  return (
    <section className="relative py-20 md:py-32" id="how-it-works" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
    }}>
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
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal">
            Your trusted pathway to exceptional nursing care
          </p>
        </AnimatedSection>
        
        {/* Desktop Horizontal Flow Layout (768px+) */}
        <div className="hidden md:block relative max-w-7xl mx-auto">
          {/* Organic Flowing Dotted Line with SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1200 400">
            {/* Main flowing dotted path exactly like reference */}
            <path 
              d="M50,150 Q200,80 300,120 Q400,160 500,100 Q600,140 700,110 Q800,150 900,120 Q1000,90 1150,130" 
              stroke="#e2e8f0" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
              fill="none" 
              opacity="0.8"
            />
            
            {/* Small directional arrows along the path */}
            <polygon points="250,115 260,120 250,125" fill="#9bcbff" opacity="0.7" />
            <polygon points="550,108 560,113 550,118" fill="#9bcbff" opacity="0.7" />
            <polygon points="850,125 860,130 850,135" fill="#9bcbff" opacity="0.7" />
          </svg>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-4 gap-8 relative z-20">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <div className="text-center relative">
                  {/* Numbered Circle */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                  }}>
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  
                  {/* Mockup Image */}
                  <div className="mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mx-auto max-w-[200px]">
                      <img 
                        src={step.mockup} 
                        alt={`${step.title} mockup`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#475569] leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        
        {/* Mobile Vertical Flow Layout (below 768px) */}
        <div className="md:hidden relative max-w-lg mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-gradient-to-b from-[#9bcbff] to-[#3b82f6] opacity-60"></div>
          
          {/* Arrows along vertical line */}
          <div className="absolute left-5 top-32">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-[#9bcbff] opacity-70"></div>
          </div>
          <div className="absolute left-5 top-64">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-[#9bcbff] opacity-70"></div>
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
                      <div className="bg-gray-50 rounded-lg p-3">
                        <img 
                          src={step.mockup} 
                          alt={`${step.title} mockup`}
                          className="w-full h-20 object-cover rounded"
                        />
                      </div>
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
