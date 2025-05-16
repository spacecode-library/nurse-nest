
import React from "react";
import { Lock, Search, Briefcase } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface PlatformFeeBannerProps {
  className?: string;
}

export default function PlatformFeeBanner({ className = "" }: PlatformFeeBannerProps) {
  return (
    <AnimatedSection animation="fade-up" className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-[#F5F7FA] border border-gray-100 rounded-xl shadow-sm p-6 md:p-7">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Platform Fees</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
          {/* Start Your Search Fee */}
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-50">
            <div className="p-2 rounded-full bg-blue-50">
              <Search className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Start Your Search</h3>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-primary-700">$100</span>
                <span className="ml-2 text-green-600 text-sm">Fully Refundable</span>
              </div>
            </div>
          </div>

          {/* Platform Fee */}
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-50">
            <div className="p-2 rounded-full bg-blue-50">
              <Briefcase className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">15% Concierge Platform Fee</h3>
              <p className="text-sm text-gray-600">Applied only when paying your nurse</p>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        <p className="text-center text-gray-600 mt-4">
          This covers vetting, secure payments, scheduling, and ongoing support.
        </p>
      </div>
    </AnimatedSection>
  );
}
