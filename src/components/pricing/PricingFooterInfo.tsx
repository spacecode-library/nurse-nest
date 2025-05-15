

import React from "react";
import { Lock } from "lucide-react";

export default function PricingFooterInfo() {
  return (
    <div className="w-full bg-[#F8F8F8] py-8 px-2 flex justify-center">
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center mb-1">
          <Lock className="w-6 h-6 md:w-7 md:h-7 text-primary-500 mr-3" />
          <span className="text-lg md:text-xl font-semibold text-gray-700">
            Secure Payment Processing
          </span>
        </div>
        <span className="text-center text-gray-700 text-[15px] md:text-base font-medium leading-relaxed">
          All payments are handled via Stripe. You pay your nurse directly, and Nurse Nest retains a 15% platform fee to handle vetting, support, and admin services.
        </span>
      </div>
    </div>
  );
}

