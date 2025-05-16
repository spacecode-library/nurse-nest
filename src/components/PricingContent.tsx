
import React from "react";
import PricingBundlesSection from "@/components/pricing/PricingBundlesSection";
import ScreeningSection from "@/components/pricing/ScreeningSection";
import PricingFooterInfo from "@/components/pricing/PricingFooterInfo";
import PlatformFeeBanner from "@/components/pricing/PlatformFeeBanner";

export default function PricingContent() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Platform Fee Banner - NEW */}
      <PlatformFeeBanner className="mb-8 mt-2" />
      
      {/* Bundles Section (white background) */}
      <PricingBundlesSection className="mb-16 mt-8" />

      {/* --- SOFT GRAY BAND --- */}
      <div className="w-full bg-[#F8F8F8]">
        {/* Build-Your-Own Screening (alternating background) */}
        <ScreeningSection className="mb-16 py-16" />
      </div>

      {/* Enhanced Payment Footer */}
      <PricingFooterInfo />
    </section>
  );
}
