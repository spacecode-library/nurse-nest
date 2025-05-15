
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center mb-12">
          <AnimatedSection animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary-500">Transparent</span> Pricing.{' '}
              <span className="relative inline-block">
                <span>Total Control.</span>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[90%] w-[117%] h-4"
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
                      stroke="#B9DDFF"
                      strokeWidth="9"
                      strokeLinecap="round"
                      style={{ filter: 'blur(1.2px)' }}
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pick a plan or build your own. Every service is handled in our secure platform.
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
