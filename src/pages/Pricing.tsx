
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingContent from '@/components/PricingContent';
import { Toaster } from '@/components/ui/toaster';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';
import AnimatedSection from '@/components/AnimatedSection';

export default function Pricing() {
  useScrollAnimationObserver();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] via-white to-[#e2e8f0]">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Luxury Header with Enhanced Typography */}
        <div
          className="container mx-auto px-4 text-center mb-16 z-20 sticky top-0 bg-white/95 backdrop-blur-sm pt-8 pb-6 shadow-sm border-b border-[#e2e8f0]"
          style={{ transition: 'background 0.3s, box-shadow 0.3s' }}
        >
          <AnimatedSection animation="fade-up">
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight text-[#1e293b]">
              <span className="text-[#9bcbff]">Transparent</span> Pricing.{' '}
              <span className="relative inline-block">
                <span>Total Control.</span>
                {/* Elegant underline accent */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[80%] w-[120%] h-4 pointer-events-none z-0"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 180 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M4 14C36 8 126 13 176 8"
                      stroke="#9bcbff"
                      strokeWidth="8"
                      strokeLinecap="round"
                      style={{ filter: 'blur(1px)' }}
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto relative z-10 leading-relaxed">
              Professional healthcare staffing with complete transparency. Every service is handled through our secure, HIPAA-compliant platform.
            </p>
          </AnimatedSection>
        </div>
        <PricingContent />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
