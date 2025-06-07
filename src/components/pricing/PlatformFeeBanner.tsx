
import React from "react";
import { Shield, ShieldCheck, CreditCard, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface PlatformFeeBannerProps {
  className?: string;
}

export default function PlatformFeeBanner({ className = "" }: PlatformFeeBannerProps) {
  return (
    <AnimatedSection animation="fade-up" className={`${className}`}>
      <div className="bg-gradient-to-br from-white via-[#f8fafc] to-[#f1f5f9] border border-[#e2e8f0] rounded-3xl shadow-lg p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-[#1e293b] mb-3">Platform Fee Structure</h2>
          <p className="text-[#475569] text-lg leading-relaxed max-w-2xl mx-auto">
            Simple, transparent pricing that covers everything you need for secure healthcare staffing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Platform Fee */}
          <div className="bg-white rounded-2xl shadow-md border border-[#e2e8f0] p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#9bcbff] to-[#3b82f6] shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#1e293b] mb-2">For Clients</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Added to your total when you hire a nurse. Covers platform operations, vetting, and secure payment processing.
                </p>
              </div>
            </div>
            
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-4xl font-light text-[#1e293b] mr-2">10%</span>
              <span className="text-[#475569] font-medium">Platform Fee</span>
            </div>
            
            <div className="space-y-3 text-sm text-[#475569]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Comprehensive nurse vetting</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>24/7 platform support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>HIPAA-compliant platform</span>
              </div>
            </div>
          </div>

          {/* Nurse Platform Fee */}
          <div className="bg-white rounded-2xl shadow-md border border-[#e2e8f0] p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1e40af] shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#1e293b] mb-2">For Nurses</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Deducted from earnings to provide access to vetted clients and comprehensive platform services.
                </p>
              </div>
            </div>
            
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-4xl font-light text-[#1e293b] mr-2">5%</span>
              <span className="text-[#475569] font-medium">Platform Fee</span>
            </div>
            
            <div className="space-y-3 text-sm text-[#475569]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Access to vetted clients</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Secure payment guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Professional support team</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                <span>Elite status program available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-2 text-[#64748b]">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Stripe Secured</span>
          </div>
          <div className="flex items-center gap-2 text-[#64748b]">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-[#64748b]">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">SSL Encrypted</span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
