
import React from 'react';
import { 
  Shield, 
  CheckCircle2,
  BadgeDollarSign,
  Clock,
  Wrench,
  Search,
  FileText,
  Car,
  AlertTriangle
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

export default function PricingContent() {
  return (
    <div className="container mx-auto px-4">
      {/* SECTION 1: VETTING BUNDLES - Side by Side Cards */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Nest Safe Basic Card */}
          <Card className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
            <CardHeader className="bg-gradient-to-r from-[#E6F4EA] to-[#F0F9F4] border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <CardTitle className="text-2xl font-bold">
                      Nest Safe Basic
                    </CardTitle>
                  </div>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold text-gray-800">$169</span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-[#E6F4EA] text-green-700 font-semibold border-[#C9E6D4] text-sm px-3 py-1 flex items-center"
                >
                  <BadgeDollarSign className="h-4 w-4 mr-1" />
                  Client Saves $15
                </Badge>
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
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
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
          
          {/* Nest Shield Pro Card */}
          <Card className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary-500 text-white px-3 py-1">Most Popular</Badge>
            </div>
            
            <CardHeader className="bg-gradient-to-r from-[#FFF4E5] to-[#FFF9F0] border-b pb-6 pt-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <CardTitle className="text-2xl font-bold">
                      Nest Shield Pro
                    </CardTitle>
                  </div>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold text-gray-800">$289</span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-[#FFF4E5] text-orange-700 font-semibold border-[#FFE4BD] text-sm px-3 py-1 flex items-center"
                >
                  <BadgeDollarSign className="h-4 w-4 mr-1" />
                  Client Saves $44
                </Badge>
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
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
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
        </div>
      </AnimatedSection>

      {/* SECTION 2: BUILD-YOUR-OWN SCREENING */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="border-t pt-12 mb-16">
          <div className="flex items-center mb-6">
            <Wrench className="h-5 w-5 text-primary-500 mr-2" />
            <h2 className="text-2xl font-bold">Build-Your-Own Screening</h2>
          </div>
          <p className="text-gray-600 mb-10">
            Customize your vetting process. Choose only what you need.
          </p>
          
          {/* Background Checks Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <Search className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-xl font-semibold">Background Checks</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Background */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">Basic Background</h4>
                    <span className="font-bold">$45</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-gray-600">
                      • SSN trace, sex offender registry, global watchlist, national criminal search
                    </li>
                  </ul>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Results: Under 24 hours
                  </div>
                </CardContent>
              </Card>
              
              {/* Comprehensive Background */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">Comprehensive Background</h4>
                    <span className="font-bold">$125</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-gray-600">
                      • All Basic features plus state & federal criminal search
                    </li>
                  </ul>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Results: 5–7 business days
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* License & Employment Verification Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-xl font-semibold">License & Employment Verification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional License Verification */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">Professional License Verification</h4>
                    <span className="font-bold">$15</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-gray-600">
                      • All active/inactive licenses
                    </li>
                  </ul>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Results: Under 24 hours
                  </div>
                </CardContent>
              </Card>
              
              {/* Employment History Verification */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">Employment History Verification</h4>
                    <span className="font-bold">$49</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-gray-600">
                      • 7-year history with job titles and dates
                    </li>
                  </ul>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Instant if nurse connects payroll provider
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Driving & Drug Testing Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <Car className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-xl font-semibold">Driving & Drug Testing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Motor Vehicle Record */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">Motor Vehicle Record</h4>
                    <span className="font-bold">$19</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-gray-600">
                      • Verifies driver's license and incident history
                    </li>
                  </ul>
                  <div className="flex items-center text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Manual setup required for Pennsylvania
                  </div>
                </CardContent>
              </Card>
              
              {/* 5-Panel Drug Test */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">5-Panel Drug Test</h4>
                    <span className="font-bold">$85</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600">
                      • Screens: Amphetamines, Cocaine, THC, Opiates, PCP
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* 10-Panel Drug Test */}
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">10-Panel Drug Test</h4>
                    <span className="font-bold">$125</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600">
                      • Includes all 5-panel + Barbiturates, Benzodiazepines, Methadone, Methaqualone, Propoxyphene
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/apply">
              <Button className="bg-primary-500 hover:bg-primary-600 px-8">
                Build Custom Package
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Payment Note */}
      <AnimatedSection animation="fade-up" delay={300} className="text-center max-w-3xl mx-auto mb-12 py-6 px-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold">Secure Payment Processing</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Payments are handled via Stripe. You pay your nurse directly, and we retain a 15% platform fee to handle vetting, onboarding, and support.
        </p>
      </AnimatedSection>
    </div>
  );
}
