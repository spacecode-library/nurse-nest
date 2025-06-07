
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import AboutMeSection from "@/components/AboutMeSection";
import ComprehensiveFaqSection from "@/components/ComprehensiveFaqSection";
import FaqSidebar from "@/components/FaqSidebar";
import FaqTriggerButton from "@/components/FaqTriggerButton";

export default function Index() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

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
        
        {/* Comprehensive FAQ Section */}
        <ComprehensiveFaqSection />
      </main>
      
      <Footer />
      
      {/* FAQ Sidebar */}
      <FaqSidebar 
        isOpen={isFaqOpen} 
        onClose={() => setIsFaqOpen(false)} 
      />
      
      {/* FAQ Trigger Button */}
      <FaqTriggerButton 
        onClick={() => setIsFaqOpen(true)} 
      />
    </div>
  );
}
