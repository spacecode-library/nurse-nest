
// PRICING PAGE REBUILD – Nurse Nest Lattice-inspired

import React from "react";
import PricingBundlesSection from "@/components/pricing/PricingBundlesSection";
import ScreeningSection from "@/components/pricing/ScreeningSection";
import PricingFooterInfo from "@/components/pricing/PricingFooterInfo";

export default function PricingContent() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Top: Page Title & Subtitle */}
      <div className="w-full max-w-4xl mx-auto text-center mb-10 mt-6 px-4">
        <h1 className="text-4xl font-heading font-bold mb-3 text-gray-800">
          Transparent Pricing. Total Control.
        </h1>
        <div className="max-w-xl mx-auto">
          <p className="text-base md:text-lg text-gray-500">
            Choose a vetted bundle or build your own screening. All services are processed securely on our HIPAA-compliant platform.
          </p>
        </div>
      </div>

      {/* Bundles Section */}
      <PricingBundlesSection className="mb-16" />
      
      {/* Build-Your-Own Screening */}
      <ScreeningSection className="mb-16" />

      {/* Info Footer */}
      <PricingFooterInfo />
    </section>
  );
}
