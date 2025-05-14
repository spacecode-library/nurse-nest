
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { Toaster } from '@/components/ui/toaster';
import { useScrollAnimationObserver } from '@/hooks/use-scroll-animation-observer';

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
        <PricingCard />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}
