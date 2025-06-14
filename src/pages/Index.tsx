import { useState } from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import LuxuriousFaqSection from "@/components/LuxuriousFaqSection";
import FloatingFaqButton from "@/components/FloatingFaqButton";

export default function Index() {
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  const toggleFaq = () => {
    setIsFaqVisible(!isFaqVisible);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Pass isHomePage prop to Navbar */}
      <NurseNestNavbar isHomePage={true} />
      
      <main className="flex-1">
        {/* Hero Section with premium platform design */}
        <HeroSection />
        
        {/* Why Choose NurseNest Section - updated content */}
        <HowItWorksSection />
        
        {/* Statistics Section */}
        <StatisticsSection />
        
        {/* FAQ Section now always visible */}
        <LuxuriousFaqSection isVisible={true} onClose={() => {}} />
      </main>
      
      {/* Floating FAQ Button */}
      <FloatingFaqButton onClick={() => {}} isOpen={false} />
      
      <Footer />
    </div>
  );
}
