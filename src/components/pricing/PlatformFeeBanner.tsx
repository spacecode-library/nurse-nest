
import React from "react";
import { Lock, Search, Briefcase, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface PlatformFeeBannerProps {
  className?: string;
}

export default function PlatformFeeBanner({ className = "" }: PlatformFeeBannerProps) {
  return (
    <AnimatedSection animation="fade-up" className={`${className}`}>
      <div className="bg-[#F9F9FA] border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">Your Search Starts Here</h2>
        <p className="text-center text-gray-600 mb-6">All pricing is transparent and secure. You only pay for what you need.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Start Your Search Fee */}
          <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-sm border border-gray-50 p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-blue-50 mt-1">
                <Search className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1.5">Fully Refundable Search Fee</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fully refundable if no nurse is matched within 14 days.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-xl font-bold text-primary-700 mr-2">$100</span>
              <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">Fully Refundable</span>
            </div>
          </div>

          {/* Platform Fee */}
          <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-sm border border-gray-50 p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-blue-50 mt-1">
                <Briefcase className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1.5">15% Concierge Platform Fee</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Only applied when you pay your nurse. Covers vetting, support, secure payments, and admin services.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center mr-3">
                <Lock className="h-3.5 w-3.5 text-gray-500 mr-1" />
                <span className="text-xs text-gray-500">Secure Payments</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-3.5 w-3.5 text-gray-500 mr-1" />
                <span className="text-xs text-gray-500">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
