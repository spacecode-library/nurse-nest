
import React from 'react';
import { Computer, Smartphone, User, Clipboard } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  const steps = [
    {
      number: 1,
      title: "Quick Care Request Submission",
      description: "Submit your nursing care requirements in minutes through our streamlined intake process designed by healthcare professionals. Our smart form captures your specific needs, schedule preferences, and specialized care requirements - no upfront fees required.",
      icon: <Computer className="h-12 w-12 text-[#3b82f6]" />
    },
    {
      number: 2,
      title: "Multi-Platform Nurse Sourcing & Matching", 
      description: "Our dedicated concierge team sources qualified nurses across multiple platforms and leverages our extensive nationwide network of licensed professionals. We utilize advanced matching algorithms to identify candidates who perfectly align with your specific care requirements, location preferences, and specialized nursing skills.",
      icon: <Smartphone className="h-12 w-12 text-[#3b82f6]" />
    },
    {
      number: 3,
      title: "Streamlined Candidate Selection",
      description: "Review curated nurse profiles, message candidates instantly, and schedule same-day video interviews. Choose from comprehensive vetting services including background checks and credential verification.",
      icon: <User className="h-12 w-12 text-[#3b82f6]" />
    },
    {
      number: 4,
      title: "Effortless Care Coordination",
      description: "Handle all care management through one convenient platform. Verify invoices, approve payments, and communicate with your nurse - everything you need in one secure, mobile-optimized dashboard.",
      icon: <Clipboard className="h-12 w-12 text-[#3b82f6]" />
    }
  ];

  return (
    <section 
      className="relative py-20 md:py-32" 
      id="how-it-works"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f1f5f9 100%)'
      }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9bcbff] to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          {/* Custom Header Image */}
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/eb87a4dd-c0a3-4a70-b22a-52f5800ce806.png" 
              alt="How It Works"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>
          
          {/* Decorative accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl md:text-2xl text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Your trusted pathway to exceptional nursing care
          </p>
        </AnimatedSection>
        
        {/* Enhanced 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={index}
              animation="fade-up" 
              delay={index * 200}
              className="relative group"
            >
              {/* Premium elevated card design */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl h-full flex flex-col relative min-h-[400px] transition-all duration-300 hover:transform hover:scale-105 border border-white/50 backdrop-blur-sm">
                
                {/* Enhanced numbered circle with gradient */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #9bcbff 0%, #3b82f6 100%)'
                    }}
                  >
                    <span className="text-white font-semibold text-lg relative z-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {step.number}
                    </span>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                  </div>
                </div>
                
                {/* Icon with enhanced styling */}
                <div className="flex justify-center mb-6 mt-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                </div>
                
                {/* Enhanced title typography */}
                <h3 
                  className="text-xl font-medium text-[#1e293b] mb-4 text-center leading-tight"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif', 
                    fontSize: '1.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {step.title}
                </h3>
                
                {/* Description with improved readability */}
                <p 
                  className="text-[#475569] leading-relaxed text-center flex-1"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.7'
                  }}
                >
                  {step.description}
                </p>

                {/* Enhanced hover accent with gradient */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6 0%, #9bcbff 100%)'
                  }}
                ></div>
                
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-2xl bg-gradient-to-br from-[#f0f9ff] to-transparent opacity-50"></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        {/* Subtle bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9bcbff] to-[#3b82f6] opacity-40"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
