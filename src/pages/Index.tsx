
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhatIsNurseNestSection from "@/components/WhatIsNurseNestSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ClientApplicationSection from "@/components/ClientApplicationSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";

export default function Index() {
  useEffect(() => {
    // Global Intersection Observer setup for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          // Unobserve after animation to avoid re-triggering
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,  // Trigger when at least 10% of the element is visible
      rootMargin: '0px 0px -50px 0px'  // Slightly above the viewport bottom
    });
    
    // Select all elements with the animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      // Initially set opacity to 0 to prevent flash
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <WhatIsNurseNestSection />
        <WhoWeHelpSection />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <ClientApplicationSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}
