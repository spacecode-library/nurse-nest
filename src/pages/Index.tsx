import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutMeSection from "@/components/AboutMeSection";
import TabFaqSection from "@/components/TabFaqSection";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Pass isHomePage prop to Navbar to prevent the FloatingCta from showing on home page */}
      <Navbar isHomePage={true} />
      
      <main className="flex-1">
        {/* Hero Section with premium platform design */}
        <HeroSection />
        
        {/* How It Works - Platform process */}
        <HowItWorksSection />
        
        {/* Who We Help - Service categories */}
        <WhoWeHelpSection />
        
        {/* About the Founder */}
        <AboutMeSection />
        
        {/* FAQ Section */}
        <TabFaqSection />
      </main>
      
      <Footer />
    </div>
  );
}