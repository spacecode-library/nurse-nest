import { useState } from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import LuxuriousFaqSection from "@/components/LuxuriousFaqSection";
import FloatingFaqButton from "@/components/FloatingFaqButton";
import ExpandableActionMenu from "@/components/ExpandableActionMenu";

export default function Index() {
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  // Show FAQ and scroll into view
  const showFaqAndScroll = () => {
    setIsFaqVisible(true);
    setTimeout(() => {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRequestNurse = () => {
    window.location.href = "/apply";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NurseNestNavbar isHomePage={true} />

      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <StatisticsSection />

        {/* Browse FAQ's Button, only show if FAQ is not visible */}
        {!isFaqVisible && (
          <div className="flex justify-center my-8">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus-visible:outline-none"
              onClick={showFaqAndScroll}
              data-testid="browse-faq-button"
            >
              Browse FAQ's
            </button>
          </div>
        )}

        {/* FAQ Section with controlled visibility */}
        <LuxuriousFaqSection
          isVisible={isFaqVisible}
          onClose={() => setIsFaqVisible(false)}
        />
      </main>

      {/* Professional expandable floating action menu (FAB) */}
      <ExpandableActionMenu
        onFaq={showFaqAndScroll}
        onRequestNurse={handleRequestNurse}
        isFaqOpen={isFaqVisible}
      />

      <Footer />
    </div>
  );
}
