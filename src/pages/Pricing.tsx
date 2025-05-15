
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
    // Ensure page scrolls to top when navigating to this page
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center mb-12">
          <AnimatedSection animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Transparent Pricing. Total Control.</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose a vetted bundle or build your own screening. All services are processed securely on our HIPAA-compliant platform.
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
