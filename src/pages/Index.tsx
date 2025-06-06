
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
        <section className="py-section bg-neutral-light">
          <HowItWorksSection />
        </section>
        
        {/* Who We Help - Service categories */}
        <section className="py-section bg-white">
          <WhoWeHelpSection />
        </section>
        
        {/* About the Founder */}
        <section className="py-section bg-neutral-light">
          <AboutMeSection />
        </section>
        
        {/* FAQ Section */}
        <section className="py-section bg-white">
          <TabFaqSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
