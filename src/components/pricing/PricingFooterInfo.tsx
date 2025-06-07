
import React from "react";
import { Lock, ShieldCheck, CreditCard, Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingFooterInfo() {
  return (
    <AnimatedSection animation="fade-up" className="w-full bg-gradient-to-br from-[#f1f5f9] via-[#f8fafc] to-[#e2e8f0] py-16 px-4 flex justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Main Security Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#e2e8f0] p-8 md:p-10 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-[#9bcbff] to-[#3b82f6] mr-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-light text-[#1e293b]">
              Secure Payment Processing
            </span>
          </div>
          
          <p className="text-center text-[#475569] text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            All payments are processed securely through Stripe with bank-level encryption. 
            You pay your nurse directly through our platform, with transparent fees covering 
            vetting, support, and comprehensive admin services.
          </p>
          
          {/* Trust Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <CreditCard className="h-8 w-8 text-[#3b82f6] mx-auto mb-3" />
              <h4 className="font-medium text-[#1e293b] mb-2">Stripe Powered</h4>
              <p className="text-sm text-[#64748b]">Industry-leading payment security</p>
            </div>
            
            <div className="text-center p-4">
              <ShieldCheck className="h-8 w-8 text-[#10b981] mx-auto mb-3" />
              <h4 className="font-medium text-[#1e293b] mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-[#64748b]">Protected health information</p>
            </div>
            
            <div className="text-center p-4">
              <Star className="h-8 w-8 text-[#f59e0b] mx-auto mb-3" />
              <h4 className="font-medium text-[#1e293b] mb-2">Elite Program</h4>
              <p className="text-sm text-[#64748b]">Earn 100% of your rates</p>
            </div>
          </div>
        </div>

        {/* Major Companies Using Stripe */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#e2e8f0] p-8 md:p-10 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-light text-[#1e293b] mb-3">
              Stripe: The Choice of Industry Leaders Worldwide
            </h3>
            <p className="text-[#475569] text-sm leading-relaxed">
              Stripe processes billions in payments every year for the world's most trusted brands.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Amazon</div>
              <div className="text-xs text-[#64748b]">E-commerce</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Shopify</div>
              <div className="text-xs text-[#64748b]">Commerce Platform</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Uber</div>
              <div className="text-xs text-[#64748b]">Transportation</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Lyft</div>
              <div className="text-xs text-[#64748b]">Rideshare</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Salesforce</div>
              <div className="text-xs text-[#64748b]">Software</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Slack</div>
              <div className="text-xs text-[#64748b]">Communication</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Zoom</div>
              <div className="text-xs text-[#64748b]">Video Conferencing</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-[#1e293b] text-lg mb-1">Netflix</div>
              <div className="text-xs text-[#64748b]">Streaming</div>
            </div>
          </div>
        </div>

        {/* Elite Program Highlight */}
        <div className="bg-gradient-to-r from-[#fef3e2] to-[#fefbf0] rounded-2xl border border-[#e5e7eb] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-5 w-5 text-[#d97706] fill-current" />
            <span className="text-lg font-medium text-[#92400e]">Verified Elite Nurse Program</span>
            <Star className="h-5 w-5 text-[#d97706] fill-current" />
          </div>
          <p className="text-[#92400e] text-sm">
            Complete 1,400+ hours across 3+ successful contracts and earn Elite status. 
            Elite nurses pay 0% platform fees and keep 100% of their earnings.
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
