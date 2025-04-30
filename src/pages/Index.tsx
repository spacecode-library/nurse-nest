
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhatIsNurseNestSection from "@/components/WhatIsNurseNestSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import JoinNetworkSection from "@/components/JoinNetworkSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <WhatIsNurseNestSection />
        <WhoWeHelpSection />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <JoinNetworkSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}
