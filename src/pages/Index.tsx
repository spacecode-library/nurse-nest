
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import LuxuriousFaqSection from "@/components/LuxuriousFaqSection";
import FloatingFaqButton from "@/components/FloatingFaqButton";
import BrowseFaqSection from "@/components/BrowseFaqSection";

export default function Index() {
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  const toggleFaq = () => {
    setIsFaqVisible(!isFaqVisible);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Pass isHomePage prop to Navbar */}
      <Navbar isHomePage={true} />
      
      <main className="flex-1">
        {/* Hero Section with premium platform design */}
        <HeroSection />
        
        {/* Why Choose NurseNest Section - updated content */}
        <HowItWorksSection />
        
        {/* Statistics Section */}
        <StatisticsSection />
        
        {/* Browse FAQ Section */}
        <BrowseFaqSection onToggleFaq={toggleFaq} isOpen={isFaqVisible} />
        
        {/* Luxurious FAQ Section - conditionally rendered */}
        <LuxuriousFaqSection isVisible={isFaqVisible} onClose={() => setIsFaqVisible(false)} />
      </main>
      
      {/* Floating FAQ Button */}
      <FloatingFaqButton onClick={toggleFaq} isOpen={isFaqVisible} />
      
      <Footer />
    </div>
  );
}
