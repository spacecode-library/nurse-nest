
import React from "react";
import PricingBundlesSection from "@/components/pricing/PricingBundlesSection";
import ScreeningSection from "@/components/pricing/ScreeningSection";
import PricingFooterInfo from "@/components/pricing/PricingFooterInfo";

export default function PricingContent() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Bundles Section (white background) */}
      <PricingBundlesSection className="mb-16 mt-10" />

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
