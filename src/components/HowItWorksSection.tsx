
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
    <section className="relative bg-[#f1f5f9] py-20 md:py-32" id="how-it-works">
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light mb-6 text-[#1e293b] tracking-wide" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            How it works
          </h2>
          <p className="text-xl md:text-2xl text-[#475569] max-w-4xl mx-auto leading-relaxed font-normal" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Nurse Nest can help you save on your home-related finances
          </p>
        </AnimatedSection>
        
        {/* 4-column grid for desktop, stacked for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection 
              key={index}
              animation="fade-up" 
              delay={index * 200}
              className="relative group"
            >
              {/* Premium white card */}
              <div className="bg-[#f0f9ff] rounded-2xl p-8 shadow-lg hover:shadow-xl h-full flex flex-col relative min-h-[400px] transition-all duration-300 hover:transform hover:scale-105 border border-white/50">
                {/* Numbered circle at top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-lg" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{step.number}</span>
                  </div>
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-6 mt-6">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-normal text-[#334155] mb-4 text-center leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '1.8rem' }}>
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#475569] leading-relaxed text-center flex-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '1rem', lineHeight: '1.6' }}>
                  {step.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3b82f6] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
