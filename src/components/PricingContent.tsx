import React from "react";
import { PricingCard } from "@/components/ui/pricing-card";
import { CustomVettingDropdown } from "@/components/ui/custom-vetting-dropdown";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Zap } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
export default function PricingContent() {
  return <section className="w-full flex flex-col items-center px-4 relative">
      {/* Background Beams - Light Mode */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      
      {/* Light overlay to ensure content readability */}
      <div className="absolute inset-0 bg-white/40 z-10"></div>
      
      <div className="relative z-20 w-full flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Premium Concierge Platform
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Transparent pricing for white-glove service including nurse discovery, interviews, 
            secure messaging, and streamlined payments.
          </p>
        </div>

        {/* Platform Fees Section */}
        <div className="w-full max-w-7xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PricingCard title={<div className="space-y-2">
                  <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-2xl font-bold text-primary">Clients</span>
                  </div>
                  <div className="text-lg text-muted-foreground font-medium">Platform Fee: 10%</div>
                </div>} description="Added to nurse's hourly rate for full-service staffing support" features={[{
            title: "Features",
            items: ["Advanced nurse search & filtering", "Flexible video interview management", "Secure messaging & communication", "Real-time availability tracking"]
          }, {
            title: "Perks",
            items: ["24/7 dedicated support", "Streamlined payment processing", "Invoice verification & management", "Quality assurance monitoring"]
          }]} />
            
            <PricingCard title={<div className="space-y-2">
                  <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-2xl font-bold text-primary">Nurses</span>
                  </div>
                  <div className="text-lg text-muted-foreground font-medium">
                    Platform Fee: 5%
                  </div>
                </div>} description="Deducted from earnings for premium contractor services" features={[{
            title: "Features",
            items: ["Access to premium job opportunities", "Professional profile optimization", "Shift management tools", "Instant payment processing"]
          }, {
            title: "Perks",
            items: ["Complete business setup guide (LLC, EIN, malpractice, banking)", "Independent contractor support", "Earn Elite status with 1,400+ hours across 3+ contracts.", "Elite nurses pay 0% fees and keep 100% earnings."]
          }]} />
          </div>
          
          {/* Security Badges */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              Stripe Secured
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Lock className="h-4 w-4" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              <Zap className="h-4 w-4" />
              SSL Encrypted
            </Badge>
          </div>
        </div>

        {/* Vetting Packages Section */}
        <div className="w-full max-w-7xl mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Popular Vetting Packages
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PricingCard title="Nest Safe Basic" description="Essential vetting for standard healthcare positions" price={169} savings="Save $15" features={[{
            title: "Features",
            items: ["Basic background check & identity verification", "Professional license verification & status", "5-panel drug screening with documentation", "Motor vehicle record & driving history"]
          }, {
            title: "Perks",
            items: ["Chain of custody documentation", "Multi-state license validation", "Sex offender registry check", "County & state criminal history"]
          }]} />
            
            <div className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-white px-3 py-1">MOST POPULAR</Badge>
              </div>
              <PricingCard title="Nest Shield Pro" description="Comprehensive vetting for high-trust healthcare roles" price={289} savings="Save $44" features={[{
              title: "Features",
              items: ["Federal & multi-state background screening", "Professional license verification & disciplinary history", "10-panel drug test with enhanced detection", "Employment verification & reference checks"]
            }, {
              title: "Perks",
              items: ["Court records verification included", "Performance & conduct review", "Enhanced identity verification", "Professional reference contacts"]
            }]} />
            </div>
          </div>
          
          {/* Custom Vetting Dropdown */}
          <CustomVettingDropdown />
        </div>

        {/* Elite Program Disclaimer */}
        <div className="w-full max-w-4xl mb-8">
          
        </div>
      </div>
    </section>;
}