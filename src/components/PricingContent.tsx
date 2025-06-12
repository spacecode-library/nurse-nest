
import React from "react";
import { PricingTable } from "@/components/ui/pricing-table";
import { PricingCard } from "@/components/ui/pricing-card";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingContent() {
  const bundleFeatures = [
    { name: "Basic Background Check", included: "basic" },
    { name: "Comprehensive Background Check", included: "pro" },
    { name: "License Verification", included: "basic" },
    { name: "5-Panel Drug Test", included: "basic" },
    { name: "10-Panel Drug Test", included: "pro" },
    { name: "Motor Vehicle Record", included: "basic" },
    { name: "Employment Verification", included: "pro" },
  ];

  const bundlePlans = [
    {
      name: "Nest Safe Basic",
      level: "basic",
      price: { monthly: 169, yearly: 169 },
    },
    {
      name: "Nest Shield Pro", 
      level: "pro",
      price: { monthly: 289, yearly: 289 },
      popular: true,
    },
  ];

  const individualScreeningFeatures = [
    { name: "Basic Background Check", included: "all" },
    { name: "Comprehensive Background Check", included: "all" },
    { name: "Professional License Verification", included: "all" },
    { name: "Employment History Verification", included: "all" },
    { name: "Motor Vehicle Record", included: "all" },
    { name: "5-Panel Drug Test", included: "all" },
    { name: "10-Panel Drug Test", included: "all" },
  ];

  const individualPlans = [
    {
      name: "Background Checks",
      level: "background",
      price: { monthly: 45, yearly: 45 },
    },
    {
      name: "License & Employment",
      level: "license",
      price: { monthly: 15, yearly: 15 },
    },
    {
      name: "Driving & Drug Testing",
      level: "testing",
      price: { monthly: 19, yearly: 19 },
    },
  ];

  return (
    <section className="w-full flex flex-col items-center py-16">
      {/* Pre-Built Bundles Section */}
      <AnimatedSection animation="fade-up" className="w-full mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#1e293b]">
            Choose a Pre-Built Bundle
          </h2>
          <p className="text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Get started with one of our most popular, curated vetting packages for the best value.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
          <PricingCard
            title="Nest Safe Basic"
            description="Standard safety assurance for most care roles"
            price={169}
            features={[
              {
                title: "Includes",
                items: [
                  "Basic Background Check",
                  "License Verification", 
                  "5-Panel Drug Test",
                  "Motor Vehicle Record"
                ],
              },
            ]}
          />
          
          <PricingCard
            title="Nest Shield Pro"
            description="Comprehensive protection for high-trust roles"
            price={289}
            features={[
              {
                title: "Includes",
                items: [
                  "Comprehensive Background Check",
                  "License Verification",
                  "10-Panel Drug Test",
                  "Employment Verification",
                  "Motor Vehicle Record"
                ],
              },
            ]}
          />
        </div>
      </AnimatedSection>

      {/* Individual Screening Services */}
      <div className="w-full bg-[#f8fafc] py-16">
        <AnimatedSection animation="fade-up" className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#1e293b]">
              Individual Screening Services
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Select individual screening services to create a custom vetting package that meets your specific requirements.
            </p>
          </div>
          
          <PricingTable
            features={individualScreeningFeatures}
            plans={individualPlans}
            defaultPlan="background"
            containerClassName="max-w-5xl"
          />
          
          {/* Detailed Pricing List */}
          <div className="max-w-4xl mx-auto mt-12 px-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1e293b] mb-6">Service Details & Pricing</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-medium text-[#1e293b] mb-4">Background Checks</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">Basic Background Check</span>
                          <p className="text-sm text-[#6b7280]">SSN trace, sex offender registry, global watchlist, national criminal search</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$45</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">Comprehensive Background Check</span>
                          <p className="text-sm text-[#6b7280]">All Basic features + state & federal criminal searches</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$125</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#e5e7eb] pt-6">
                    <h4 className="text-lg font-medium text-[#1e293b] mb-4">License & Employment Verification</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">Professional License Verification</span>
                          <p className="text-sm text-[#6b7280]">All active/inactive licenses</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$15</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">Employment History Verification</span>
                          <p className="text-sm text-[#6b7280]">7-year lookback, job title & date confirmation</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$49</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#e5e7eb] pt-6">
                    <h4 className="text-lg font-medium text-[#1e293b] mb-4">Driving & Drug Testing</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">Motor Vehicle Record</span>
                          <p className="text-sm text-[#6b7280]">License confirmation & incident history</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$19</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">5-Panel Drug Test</span>
                          <p className="text-sm text-[#6b7280]">Amphetamines, Cocaine, THC, Opiates, PCP</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$85</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-[#374151]">10-Panel Drug Test</span>
                          <p className="text-sm text-[#6b7280]">Includes all 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene</p>
                        </div>
                        <span className="font-semibold text-[#1e293b]">$125</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Elite Status Program Badge */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-8 py-6 px-4 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-lg">
        <div className="flex items-center justify-center mb-3">
          <div className="h-5 w-5 text-[#3b82f6] mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1e293b]">Elite Status Program Available for Nurses</h3>
        </div>
        <p className="text-[#475569] text-sm">
          Our top-performing nurses gain access to exclusive opportunities and premium client matches.
        </p>
      </AnimatedSection>
      
      {/* Secure Payment Processing Badge */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto py-6 px-4 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-lg">
        <div className="flex items-center justify-center mb-3">
          <div className="h-5 w-5 text-[#3b82f6] mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1e293b]">Secure Payment Processing for Clients</h3>
        </div>
        <p className="text-[#475569] text-sm">
          Payments are handled via Stripe. You pay your nurse directly, and we retain a 15% platform fee to handle vetting, onboarding, and support.
        </p>
      </AnimatedSection>
    </section>
  );
}
