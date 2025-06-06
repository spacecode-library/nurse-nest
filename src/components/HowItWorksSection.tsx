
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Computer, Mobile, User, Clipboard } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';
import { useIsMobile } from '@/hooks/use-mobile';

export default function HowItWorksSection() {
  // Use our custom hook to set up scroll animation
  useScrollAnimationObserver();
  
  const isMobile = useIsMobile();
  
  const steps = [
    {
      number: 1,
      title: "Quick Care Request Submission",
      description: "Submit your nursing care requirements in minutes through our streamlined intake process designed by healthcare professionals. Our smart form captures your specific needs, schedule preferences, and specialized care requirements - no upfront fees required.",
      icon: <Computer className="h-16 w-16 text-blue-600" />
    },
    {
      number: 2,
      title: "Multi-Platform Nurse Sourcing & Matching", 
      description: "Our dedicated concierge team sources qualified nurses across multiple platforms and leverages our extensive nationwide network of licensed professionals. We utilize advanced matching algorithms to identify candidates who perfectly align with your specific care requirements, location preferences, and specialized nursing skills.",
      icon: <Mobile className="h-16 w-16 text-blue-600" />
    },
    {
      number: 3,
      title: "Streamlined Candidate Selection",
      description: "Review curated nurse profiles, message candidates instantly, and schedule same-day video interviews. Choose from comprehensive vetting services including background checks and credential verification.",
      icon: <User className="h-16 w-16 text-blue-600" />
    },
    {
      number: 4,
      title: "Effortless Care Coordination",
      description: "Handle all care management through one convenient platform. Verify invoices, approve payments, and communicate with your nurse - everything you need in one secure, mobile-optimized dashboard.",
      icon: <Clipboard className="h-16 w-16 text-blue-600" />
    }
  ];

  return (
    <section className="relative overflow-hidden" id="how-it-works">
      {/* Blue gradient background section */}
      <div className="bg-gradient-to-b from-[#87CEEB] to-[#4A90E2] py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-light mb-6 text-white">
              How it works
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-light">
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
                className="relative"
              >
                {/* White card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col relative">
                  {/* Numbered circle at top */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#4A90E2]">
                      <span className="text-[#4A90E2] font-bold text-lg">{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-6 mt-4">
                    {step.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed text-center flex-1">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hard cut to white background */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up" delay={300}>
            <Link to="/apply">
              <Button className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
                Request a Nurse
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
