import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2,
  Lock,
  Clipboard,
  Car,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AnimatedSection from './AnimatedSection';

export default function PricingCards() {
  return (
    <div className="container mx-auto px-4">
      {/* Pricing Bundles - Desktop: Side by Side, Mobile: Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Basic Bundle */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div
            className="
              border rounded-2xl overflow-hidden
              shadow-xl hover:shadow-[0_18px_54px_-9px_rgba(30,136,229,0.18),0_8px_40px_0_rgba(30,136,229,0.11)]
              transition-all h-full bg-gradient-to-br from-[#e5f1fb] via-[#f0f7ff] to-[#cbe7fd]
              border-blue-200 relative card-soft-shadow card-hover-elevate
              hover:scale-[1.033] will-change-transform
            "
            style={{ boxShadow: "0 8px 32px 0 rgba(30,136,229,0.15), 0 1.5px 6px 0 #B9DDFF80" }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b pb-6 rounded-t-2xl pt-8 px-6 flex flex-col h-auto">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-5 w-5 text-primary-500" />
                    <span className="text-2xl font-bold text-primary-700">Nest Safe Basic</span>
                  </div>
                  <span className="text-base font-medium text-gray-600">Standard safety assurance</span>
                </div>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-primary-800 drop-shadow-sm">$169</span>
              </div>
            </div>

            <div className="pt-6 px-6">
              <h3 className="font-semibold text-gray-700 mb-4">Includes:</h3>
              <ul className="space-y-3">
                {[
                  'Basic Background Check',
                  'License Verification',
                  '5-Panel Drug Test',
                  'Motor Vehicle Record'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6 pb-6 rounded-b-2xl px-6">
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-4">
                  Best for: Standard safety assurance for most care roles.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-primary-500 hover:bg-primary-700 text-white shadow-lg">
                    Select This Bundle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Pro Bundle */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div
            className="
              pro-shadow
              luxury-gold-gradient
              rounded-2xl overflow-hidden
              border border-[#f6e6ac]
              transition-all h-full relative card-soft-shadow card-hover-elevate hover:scale-[1.04]
              will-change-transform
              hover:shadow-[0_22px_85px_-15px_rgba(191,169,69,0.32),0_8px_40px_0_rgba(191,169,69,0.25)]
              before:rounded-2xl
              before:pointer-events-none
            "
            style={{
              boxShadow: "0 12px 45px 0 #e6d6b7a8, 0 6px 36px 0 #ffe08244, 0 2px 8px 0 #d3be83",
              background: "linear-gradient(135deg, #FFF9EA 0%, #FFE699 60%, #FFE082 100%)",
            }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="brand-badge-pill bg-[#FFD700] text-yellow-900 border border-yellow-200 shadow">Most Popular</span>
            </div>
            <div
              className="bg-gradient-to-r from-[#fff5df] to-[#ffe8a3] border-b pb-6 pt-10 rounded-t-2xl px-6"
              style={{
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem"
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-[#b39a47] drop-shadow-glow-gold" />
                    <span className="text-2xl font-bold text-gold-900" style={{ color: "#a3822b", textShadow: "0 1px 8px #ffefb544" }}>
                      Nest Shield Pro
                    </span>
                  </div>
                  <span className="text-base font-medium" style={{ color: "#bba037" }}>
                    Comprehensive protection
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold drop-shadow-glow-gold" style={{ color: "#9f7d24", textShadow: "0 0 12px #ffe8a366, 0 2px 8px #ffe08290" }}>
                  $289
                </span>
              </div>
            </div>

            <div className="pt-6 px-6">
              <h3 className="font-semibold" style={{ color: "#9B803D" }}>Includes:</h3>
              <ul className="space-y-3">
                {[
                  'Comprehensive Background Check',
                  'License Verification',
                  '10-Panel Drug Test',
                  'Employment Verification',
                  'Motor Vehicle Record'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5" style={{ color: "#bba037" }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6 pb-6 rounded-b-2xl px-6">
              <div className="w-full">
                <p className="text-sm" style={{ color: "#796431" }}>
                  Best for: High-trust roles requiring deeper security and work history screening.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-[#ffedbe] hover:bg-[#ffe082] text-[#a3822b] font-semibold shadow-xl border border-[#e6d6b7]">
                    Select This Bundle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Build Your Own Section */}
      <AnimatedSection animation="fade-up" delay={300} className="mb-16">
        <div className="bg-gray-50 rounded-xl p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                <path d="M14 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
                <path d="M18 6a6 6 0 0 0-12 0"></path>
                <path d="M12 2v4"></path>
                <path d="M4.93 10.887a8 8 0 0 0-.78 3.00A11.996 11.996 0 0 0 12 22a11.996 11.996 0 0 0 7.85-8.111 7.98 7.98 0 0 0-.78-3.001"></path>
                <path d="M9.5 10.5 12 13l2.5-2.5"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Build-Your-Own Screening</h2>
          </div>
          <p className="text-gray-600 mb-6">Customize your vetting process to meet your specific needs.</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="background-checks">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary-500" />
                  Background Checks
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-2">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$45</span>
                      <h4 className="font-semibold text-lg">Basic Background</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      SSN trace, sex offender registry, global watchlist, national criminal search
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Results: Under 24 hours
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$125</span>
                      <h4 className="font-semibold text-lg">Comprehensive Background</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Includes all Basic features + state & federal criminal searches
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Results: 5–7 business days
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="license-employment">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <Clipboard className="h-5 w-5 mr-2 text-primary-500" />
                  License & Employment Verification
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-2">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$15</span>
                      <h4 className="font-semibold text-lg">Professional License Verification</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Report of all active and inactive licenses
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Results: Under 24 hours
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$49</span>
                      <h4 className="font-semibold text-lg">Employment History Verification</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      7-year history, confirms job titles and dates
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="driving-drug">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-primary-500" />
                  Driving & Drug Testing
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-2">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$19</span>
                      <h4 className="font-semibold text-lg">Motor Vehicle Record</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Confirms valid license and driving history
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$85</span>
                      <h4 className="font-semibold text-lg">5-Panel Drug Test</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Includes Amphetamines, Cocaine, THC, Opiates, and PCP
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xl text-primary-700 min-w-[70px] text-left mr-6">$125</span>
                      <h4 className="font-semibold text-lg">10-Panel Drug Test</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Includes all 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-6">
            <Link to="/apply">
              <Button className="bg-primary-500 hover:bg-primary-600">
                Build Custom Package
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Payment Note */}
      <AnimatedSection animation="fade-up" delay={400} className="text-center max-w-3xl mx-auto mb-12 py-6 px-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center mb-3">
          <Lock className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold">Secure Payment Processing</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Payments are handled via Stripe. You pay your nurse directly, and we retain a 15% platform fee to handle vetting, onboarding, and support.
        </p>
      </AnimatedSection>
    </div>
  );
}

// Custom CSS for 3D effects and gold improvements
