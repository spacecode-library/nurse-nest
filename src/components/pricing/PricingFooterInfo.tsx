
import React from "react";
import { Lock } from "lucide-react";

export default function PricingFooterInfo() {
  return (
    <div className="w-full bg-gray-50 py-6 px-2 flex justify-center">
      <div className="flex items-center justify-center gap-2 rounded-xl max-w-2xl mx-auto">
        <Lock className="w-5 h-5 text-primary-500" />
        <span className="text-center text-gray-700 text-sm md:text-base font-medium">
          <span className="font-semibold mr-1">Secure Payment Processing</span>
          All payments are handled via Stripe. You pay your nurse directly, and Nurse Nest retains a 15% platform fee to handle vetting, support, and admin services.
        </span>
      </div>
    </div>
  );
}
