
import React from "react";
import { Lock, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingFooterInfo() {
  return (
    <AnimatedSection animation="fade-up" className="w-full bg-[#F0F4F9] py-10 px-4 flex justify-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center mb-1">
          <Lock className="w-5 h-5 md:w-6 md:h-6 text-primary-600 mr-3" />
          <span className="text-xl md:text-2xl font-semibold text-gray-800">
            Secure Payment Processing
          </span>
        </div>
        <p className="text-center text-gray-700 text-[15px] md:text-base font-medium leading-relaxed">
          All payments are handled securely via Stripe. You pay your nurse directly. 
          Nurse Nest retains a 15% platform fee to manage vetting, support, and admin services.
        </p>
        
        <div className="flex items-center justify-center space-x-6 mt-2">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="20" viewBox="0 0 32 20" className="mr-2">
              <path d="M29.6,0H2.4C1.1,0,0,1.1,0,2.4v15.1C0,18.9,1.1,20,2.4,20h27.2c1.3,0,2.4-1.1,2.4-2.4V2.4C32,1.1,30.9,0,29.6,0z" fill="#6772E5"/>
              <path d="M15,14c-2.2,0-4-1.8-4-4s1.8-4,4-4c1,0,1.9,0.4,2.6,1c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0 c-0.5-0.5-1.2-0.7-1.9-0.7c-1.7,0-3,1.3-3,3s1.3,3,3,3c0.8,0,1.6-0.3,2.1-0.9c0.2-0.2,0.5-0.2,0.7,0c0.2,0.2,0.2,0.5,0,0.7 C17.1,13.5,16.1,14,15,14z" fill="#FFFFFF"/>
              <path d="M20.4,13.7c-0.2,0-0.3-0.1-0.4-0.2l-2-2.5v2.3c0,0.3-0.2,0.5-0.5,0.5s-0.5-0.2-0.5-0.5V7.3c0-0.3,0.2-0.5,0.5-0.5 s0.5,0.2,0.5,0.5v2.3l2-2.5c0.2-0.2,0.5-0.3,0.7-0.1c0.2,0.2,0.3,0.5,0.1,0.7l-1.8,2.3l1.8,2.3c0.2,0.2,0.1,0.5-0.1,0.7 C20.6,13.7,20.5,13.7,20.4,13.7z" fill="#FFFFFF"/>
              <path d="M8,13.7c-2.1,0-3.7-1.7-3.7-3.7S5.9,6.3,8,6.3s3.7,1.7,3.7,3.7S10.1,13.7,8,13.7z M8,7.3c-1.5,0-2.7,1.2-2.7,2.7 s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S9.5,7.3,8,7.3z" fill="#FFFFFF"/>
              <path d="M24.8,13.7c-2.1,0-3.7-1.7-3.7-3.7s1.7-3.7,3.7-3.7s3.7,1.7,3.7,3.7S26.8,13.7,24.8,13.7z M24.8,7.3 c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S26.3,7.3,24.8,7.3z" fill="#FFFFFF"/>
            </svg>
          </div>
          <div className="flex items-center text-gray-600">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium">HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
