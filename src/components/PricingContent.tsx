
import React from "react";
import PricingBundlesSection from "@/components/pricing/PricingBundlesSection";
import ScreeningSection from "@/components/pricing/ScreeningSection";
import PricingFooterInfo from "@/components/pricing/PricingFooterInfo";
import PlatformFeeBanner from "@/components/pricing/PlatformFeeBanner";

export default function PricingContent() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Platform Fee Banner - Info Banner */}
      <PlatformFeeBanner className="mb-10 mt-6 w-full max-w-4xl" />
      
      {/* Bundles Section */}
      <div className="w-full py-6 mb-12">
        <PricingBundlesSection className="mb-8" />
      </div>

      {/* --- ALT BACKGROUND --- */}
      <div className="w-full bg-[#F8F8F8] py-10">
        {/* Build-Your-Own Screening */}
        <ScreeningSection className="mb-8" />
      </div>

      {/* Enhanced Payment Footer */}
      <PricingFooterInfo />
    </section>
  );
}
