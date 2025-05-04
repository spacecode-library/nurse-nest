
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhatIsNurseNestSection from "@/components/WhatIsNurseNestSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutMeSection from "@/components/AboutMeSection";
import FaqSection from "@/components/FaqSection";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const [showNavbarCta, setShowNavbarCta] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Handle navbar CTA visibility
    const handleScroll = () => {
      const heroButton = document.querySelector('#hero-cta-button');
      if (heroButton) {
        // Check if hero button is out of viewport
        const rect = heroButton.getBoundingClientRect();
        setShowNavbarCta(rect.bottom < 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Only initialize animations on non-mobile devices
    if (!isMobile) {
      // Global Intersection Observer setup for fade-in animations with slower, more exaggerated effect
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
      
      // Select all elements to animate
      document.querySelectorAll('.animate-on-scroll, button, img, a, h1, h2, h3, h4, h5, h6, p, li').forEach((el) => {
        // Initially set opacity to 0 to prevent flash
        el.classList.add('opacity-0');
        // Add the animate-on-scroll class if it doesn't have it
        if (!el.classList.contains('animate-on-scroll')) {
          el.classList.add('animate-on-scroll');
        }
        observer.observe(el);
      });
      
      return () => {
        observer.disconnect();
      };
    } else {
      // On mobile, make sure everything is visible without animations
      document.querySelectorAll('.animate-on-scroll, button, img, a, h1, h2, h3, h4, h5, h6, p, li').forEach((el) => {
        el.classList.remove('opacity-0');
        el.classList.add('opacity-100');
      });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showCta={showNavbarCta} />
      
      <main className="flex-1">
        <HeroSection />
        <WhatIsNurseNestSection />
        <WhoWeHelpSection />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <AboutMeSection />
        <FaqSection />
      </main>
      
      <Footer />
    </div>
  );
}
