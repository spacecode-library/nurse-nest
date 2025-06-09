
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import AboutMeSection from "@/components/AboutMeSection";
import LuxuriousFaqSection from "@/components/LuxuriousFaqSection";
import FloatingFaqButton from "@/components/FloatingFaqButton";
import BrowseFaqSection from "@/components/BrowseFaqSection";

export default function Index() {
  const [showFaq, setShowFaq] = useState(false);

  const handleFaqToggle = () => {
    setShowFaq(!showFaq);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Pass isHomePage prop to Navbar */}
      <Navbar isHomePage={true} />
      
      <main className="flex-1">
        {/* Hero Section with premium platform design */}
        <HeroSection />
        
        {/* How It Works - Platform process - no gap */}
        <HowItWorksSection />
        
        {/* Statistics Section */}
        <StatisticsSection />
        
        {/* About the Founder */}
        <AboutMeSection />
        
        {/* Browse FAQ Section - always visible */}
        <BrowseFaqSection onBrowseFaqClick={handleFaqToggle} />
        
        {/* FAQ Section - only show when requested */}
        {showFaq && <LuxuriousFaqSection />}
      </main>
      
      <Footer />
      
      {/* Floating FAQ Button */}
      <FloatingFaqButton onClick={handleFaqToggle} />
    </div>
  );
}
