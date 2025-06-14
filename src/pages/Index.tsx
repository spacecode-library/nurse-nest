import { useState } from "react";
import NurseNestNavbar from "@/components/NurseNestNavbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatisticsSection from "@/components/StatisticsSection";
import LuxuriousFaqSection from "@/components/LuxuriousFaqSection";
import FloatingFaqButton from "@/components/FloatingFaqButton";
import ExpandableActionMenu from "@/components/ExpandableActionMenu";
import ActionCardsRow from "@/components/ActionCardsRow";
import { useFadeInOnScroll } from "@/hooks/use-fade-in-on-scroll";

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

  // Only fade in FAB *after* scrolling past hero (approx 65% vh)
  const fabMenuVisible = useFadeInOnScroll();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NurseNestNavbar isHomePage={true} />

      <main className="flex-1">
        {/* Apply enhanced glass card effect on Hero Section (if card exists there) */}
        <HeroSection />
        <HowItWorksSection />
        <StatisticsSection />

        {/* Action Cards Row (replaces single Browse FAQ button), only show if FAQ is not visible */}
        {!isFaqVisible && (
          <ActionCardsRow
            onFaq={showFaqAndScroll}
            onGetNurse={handleRequestNurse}
          />
        )}

        {/* FAQ Section with controlled visibility */}
        <LuxuriousFaqSection
          isVisible={isFaqVisible}
          onClose={() => setIsFaqVisible(false)}
        />
      </main>

      {/* FAB Action Menu - now visible only after scrolling past hero */}
      <ExpandableActionMenu
        onFaq={showFaqAndScroll}
        onRequestNurse={handleRequestNurse}
        isFaqOpen={isFaqVisible}
        visible={fabMenuVisible}
      />

      <Footer />
    </div>
  );
}
