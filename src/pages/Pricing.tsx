
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingContent from '@/components/PricingContent';
import { Toaster } from '@/components/ui/toaster';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

export default function Pricing() {
  useScrollAnimationObserver();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] via-white to-[#e2e8f0]">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <PricingContent />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
