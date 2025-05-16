
import React from "react";
import { Lock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingFooterInfo() {
  return (
    <AnimatedSection animation="fade-up" className="w-full bg-[#E0EFFF] py-8 px-4 flex justify-center">
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center mb-1">
          <Lock className="w-6 h-6 md:w-7 md:h-7 text-primary-500 mr-3" />
          <span className="text-lg md:text-xl font-semibold text-gray-700">
            Secure Payment Processing
          </span>
        </div>
        <span className="text-center text-gray-700 text-[15px] md:text-base font-medium leading-relaxed">
          All payments are processed through Stripe. You pay your nurse directly, and Nurse Nest retains a 15% platform fee to manage vetting, support, and administration.
        </span>
      </div>
    </AnimatedSection>
  );
}
