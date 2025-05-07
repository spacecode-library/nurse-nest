
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhatIsNurseNestSection from "@/components/WhatIsNurseNestSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutMeSection from "@/components/AboutMeSection";
import FaqSection from "@/components/FaqSection";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const [showNavbarCta, setShowNavbarCta] = useState(false);
  const isMobile = useIsMobile();

  // Handle navbar CTA visibility on scroll
  window.onscroll = function() {
    const heroButton = document.querySelector('#hero-cta-button');
    if (heroButton) {
      // Check if hero button is out of viewport
      const rect = heroButton.getBoundingClientRect();
      setShowNavbarCta(rect.bottom < 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showCta={showNavbarCta} />
      
      <main className="flex-1">
        <HeroSection />
        <WhatIsNurseNestSection />
        <WhoWeHelpSection />
        <HowItWorksSection />
        <AboutMeSection />
        <FaqSection />
      </main>
      
      <Footer />
    </div>
  );
}
