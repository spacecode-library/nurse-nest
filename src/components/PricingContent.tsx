
import React from "react";
import { PricingTable } from "@/components/ui/pricing-table";
import { PricingCard } from "@/components/ui/pricing-card";
import PricingFooterInfo from "@/components/pricing/PricingFooterInfo";
import PlatformFeeBanner from "@/components/pricing/PlatformFeeBanner";
import AnimatedSection from "@/components/AnimatedSection";

export default function PricingContent() {
  const bundlePlans = [
    {
      name: "Nest Safe Basic",
      level: "basic",
      price: 169,
      savings: "Saves $15",
    },
    {
      name: "Nest Shield Pro", 
      level: "pro",
      price: 289,
      savings: "Saves $44",
      popular: true,
    },
  ];

  const bundleFeatures = [
    { name: "Basic Background Check", included: "basic" },
    { name: "Comprehensive Background Check", included: "pro" },
    { name: "License Verification", included: "basic" },
    { name: "5-Panel Drug Test", included: "basic" },
    { name: "10-Panel Drug Test", included: "pro" },
    { name: "Motor Vehicle Record", included: "basic" },
    { name: "Employment Verification", included: "pro" },
  ];

  const customScreeningFeatures = [
    {
      title: "Background Checks",
      items: [
        "Basic Background Check - $45 (SSN trace, sex offender registry, global watchlist, national criminal search)",
        "Comprehensive Background Check - $125 (All Basic features + state & federal criminal searches)",
      ],
    },
    {
      title: "License & Employment Verification", 
      items: [
        "Professional License Verification - $15 (All active/inactive licenses)",
        "Employment History Verification - $49 (7-year lookback, job title & date confirmation)",
      ],
    },
    {
      title: "Driving & Drug Testing",
      items: [
        "Motor Vehicle Record - $19 (License confirmation & incident history)",
        "5-Panel Drug Test - $85 (Amphetamines, Cocaine, THC, Opiates, PCP)",
        "10-Panel Drug Test - $125 (Includes all 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene)",
      ],
    },
  ];

  return (
    <section className="w-full flex flex-col items-center">
      {/* Platform Fee Banner */}
      <PlatformFeeBanner className="mb-12 mt-6 w-full max-w-4xl" />
      
      {/* Pre-Built Bundles Section */}
      <AnimatedSection animation="fade-up" className="w-full mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#1e293b]">
            Choose a Pre-Built Bundle
          </h2>
          <p className="text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Get started with one of our most popular, curated vetting packages for the best value.
          </p>
        </div>
        
        <PricingTable
          features={bundleFeatures}
          plans={bundlePlans}
          defaultPlan="pro"
          containerClassName="max-w-4xl"
        />
      </AnimatedSection>

      {/* Build Your Own Section */}
      <div className="w-full bg-[#f8fafc] py-16">
        <AnimatedSection animation="fade-up" className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#1e293b]">
              Build Your Custom Package
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Select individual screening services to create a custom vetting package that meets your specific requirements.
            </p>
          </div>
          
          <PricingCard
            title="Build-Your-Own Screening"
            description="Customize your vetting process to meet your specific needs with individual screening services."
            price="Custom Pricing"
            features={customScreeningFeatures}
          />
        </AnimatedSection>
      </div>

      {/* Payment Footer */}
      <PricingFooterInfo />
    </section>
  );
}
