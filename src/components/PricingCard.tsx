
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { CircleDollarSign, Shield, Info } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { toast } from '@/hooks/use-toast';

export default function PricingCard() {
  const basePrice = 100;

  const handleGoToPayment = () => {
    // Store the selection in session storage for the payment page
    const applicationData = {
      formData: {
        addOns: {
          drugTest: false,
          drivingHistory: false,
          backgroundCheck: false,
          tbTest: false,
          goldPackage: false
        }
      },
      pricing: {
        basePrice: basePrice,
        totalPrice: basePrice
      }
    };
    
    sessionStorage.setItem('applicationData', JSON.stringify(applicationData));
    toast({
      title: "Your selection has been saved!",
      description: "Taking you to payment...",
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent, Upfront Pricing</h2>
        <p className="text-lg text-gray-700">Simple pricing. Optional upgrades. No surprises.</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Required Service */}
        <motion.div 
          className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 mb-8"
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <div className="bg-gradient-to-r from-nurse-dark to-primary-500 p-5 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Nurse Search Fee
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-3xl font-bold mb-2 text-primary-600">$100</div>
                <p className="text-gray-700">
                  Begin your personalized RN match with a fully refundable search fee 
                  (if we don't match you in 14 days).
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Add-ons Preview - Coming in next phase */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-center">
            Additional Vetting Options <span className="text-gray-500 text-sm">(Available after matching)</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 opacity-75">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Drug Test (10-panel)</h4>
                    <p className="text-sm text-gray-600">Additional verification for peace of mind</p>
                  </div>
                  <span className="text-lg font-bold">$100</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Driving History Report</h4>
                    <p className="text-sm text-gray-600">For nurses who will provide transportation</p>
                  </div>
                  <span className="text-lg font-bold">$50</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Background Check</h4>
                    <p className="text-sm text-gray-600">Detailed national background check</p>
                  </div>
                  <span className="text-lg font-bold">$50</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">TB Test Clearance</h4>
                    <p className="text-sm text-gray-600">Proof of recent negative TB test</p>
                  </div>
                  <span className="text-lg font-bold">$250</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 col-span-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold">Gold Vetting Package</h4>
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Most Comprehensive</span>
                    </div>
                    <p className="text-sm text-gray-600">Includes Background Check, Drug Test, and Driving History Report</p>
                  </div>
                  <span className="text-lg font-bold">$150</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Secure Payment Info */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 border-l-4 border-primary-500">
          <div className="flex items-start">
            <CircleDollarSign className="h-8 w-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Payment Processing</h3>
              <p className="text-gray-700">
                Payments are handled via Stripe. You pay your nurse directly, and we retain a 15% platform fee to handle vetting, onboarding, and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
