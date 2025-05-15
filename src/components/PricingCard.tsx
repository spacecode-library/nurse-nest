
import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BadgeDollarSign, 
  Lock
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

export default function PricingCard() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="container mx-auto px-4">
      <AnimatedSection animation="fade-up" className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Vetting Options</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choose from our pre-built bundles for the best value or customize your screening process.
          All screening services are HIPAA-compliant and handled with the utmost security.
        </p>
      </AnimatedSection>

      {/* Pricing Bundles - Desktop: Side by Side, Mobile: Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Basic Bundle */}
        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-5 w-5 text-primary-500" />
                    <CardTitle className="text-2xl font-bold">
                      Nest Safe Basic
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-600">
                    Standard safety assurance
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary-100 text-primary-600 font-semibold border-primary-200 text-sm px-3 py-1 flex items-center">
                  <BadgeDollarSign className="h-4 w-4 mr-1" />
                  Client Saves $15
                </Badge>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-gray-800">$169</span>
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
            
            <CardFooter className="border-t pt-6 pb-6">
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-4">
                  Best for: Standard safety assurance for most care roles.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600">
                    Select This Bundle
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </AnimatedSection>
        
        {/* Pro Bundle */}
        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary-500 text-white px-3 py-1">Most Popular</Badge>
            </div>
            
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 border-b pb-6 pt-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <CardTitle className="text-2xl font-bold">
                      Nest Shield Pro
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-600">
                    Comprehensive protection
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary-100 text-primary-600 font-semibold border-primary-200 text-sm px-3 py-1 flex items-center">
                  <BadgeDollarSign className="h-4 w-4 mr-1" />
                  Client Saves $44
                </Badge>
              </div>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold text-gray-800">$289</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Includes:</h3>
              <ul className="space-y-3">
                {[
                  'Comprehensive Background Check',
                  'License Verification',
                  '10-Panel Drug Test',
                  'Employment Verification',
                  'Motor Vehicle Record'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="border-t pt-6 pb-6">
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-4">
                  Best for: High-trust roles requiring deeper security and work history screening.
                </p>
                <Link to="/apply" className="w-full block">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600">
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
                Background Checks
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
                      Results: &lt; 24 hours
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Comprehensive Background</h4>
                      <span className="font-bold">$125</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      All Basic features + state & federal criminal searches
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
                License & Employment Verification
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-2">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Professional License Verification</h4>
                      <span className="font-bold">$15</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      All active/inactive licenses
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Results: &lt; 24 hours
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Employment History Verification</h4>
                      <span className="font-bold">$49</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      7-year lookback, job title & date confirmation
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
                Driving & Drug Testing
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 py-2">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Motor Vehicle Record</h4>
                      <span className="font-bold">$19</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      License confirmation & incident history
                    </p>
                    <div className="flex items-center text-sm text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      PA requires manual processing
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
