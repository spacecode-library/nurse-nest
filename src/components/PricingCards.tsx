import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2,
  BadgeDollarSign,
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
          <Card className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full bg-[#F0F7FF] border-blue-200 relative card-soft-shadow card-hover-elevate">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b pb-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-5 w-5 text-primary-500" />
                    <CardTitle className="text-2xl font-bold text-primary-700">
                      Nest Safe Basic
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-600">
                    Standard safety assurance
                  </CardDescription>
                </div>
                {/* Removed blue badge here */}
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-primary-800 drop-shadow-sm">$169</span>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
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
            </CardContent>

            <CardFooter className="border-t pt-6 pb-6 rounded-b-2xl">
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-4">
                  Best for: Standard safety assurance for most care roles.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600 button-hover-effect">
                    Select This Bundle
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </AnimatedSection>

        {/* Pro Bundle */}
        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="luxury-gold-gradient rounded-2xl overflow-hidden shadow-md transition-all h-full relative card-soft-shadow card-hover-elevate hover:glow-gold before:rounded-2xl border border-[#f0d686]">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              {/* Most Popular Badge */}
              <span className="brand-badge-pill bg-[#FFD700] text-yellow-900 border border-yellow-200 shadow">Most Popular</span>
            </div>
            <CardHeader className="bg-gradient-to-r from-[#fff5df] to-[#ffe8a3] border-b pb-6 pt-8 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-[#b39a47]" />
                    <CardTitle className="text-2xl font-bold text-[#a3822b]">
                      Nest Shield Pro
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium text-[#bba037]">
                    Comprehensive protection
                  </CardDescription>
                </div>
                {/* Removed gold badge here */}
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-[#9f7d24] drop-shadow-glow-gold">$289</span>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <h3 className="font-semibold text-[#937045] mb-4">Includes:</h3>
              <ul className="space-y-3">
                {[
                  'Comprehensive Background Check',
                  'License Verification',
                  '10-Panel Drug Test',
                  'Employment Verification',
                  'Motor Vehicle Record'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#bba037] mt-0.5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="border-t pt-6 pb-6 rounded-b-2xl">
              <div className="w-full">
                <p className="text-sm text-[#796431] mb-4">
                  Best for: High-trust roles requiring deeper security and work history screening.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-[#bfa945] hover:bg-[#e7d481] text-white font-semibold button-hover-effect">
                    Select This Bundle
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
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
                      <h4 className="font-semibold">Basic Background</h4>
                      <span className="font-bold">$45</span>
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
                      <h4 className="font-semibold">Comprehensive Background</h4>
                      <span className="font-bold">$125</span>
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
                      <h4 className="font-semibold">Professional License Verification</h4>
                      <span className="font-bold">$15</span>
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
                      <h4 className="font-semibold">Employment History Verification</h4>
                      <span className="font-bold">$49</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      7-year history, confirms job titles and dates
                    </p>
                    <div className="flex items-center text-sm text-primary-500">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Instant if nurse connects payroll provider
                    </div>
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
                      <h4 className="font-semibold">Motor Vehicle Record</h4>
                      <span className="font-bold">$19</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Confirms valid license and driving history
                    </p>
                    <div className="flex items-center text-sm text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Manual processing required for PA
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">5-Panel Drug Test</h4>
                      <span className="font-bold">$85</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Screens: Amphetamines, Cocaine, THC, Opiates, PCP
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">10-Panel Drug Test</h4>
                      <span className="font-bold">$125</span>
                    </div>
                    <p className="text-sm text-gray-600">
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
