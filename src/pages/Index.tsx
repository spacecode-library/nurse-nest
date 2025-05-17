
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <WhoWeHelpSection />
        <AboutMeSection />
        <TabFaqSection />
      </main>
      
      <Footer />
    </div>
  );
}
